
-- Roles enum & user_roles table (separate, secure)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles select authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admins delete profiles" ON public.profiles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Accounts
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL UNIQUE DEFAULT lpad((floor(random()*1000000000000))::TEXT, 12, '0'),
  balance NUMERIC(14,2) NOT NULL DEFAULT 1000.00 CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "accounts select own or admin" ON public.accounts FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "accounts insert own" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins delete accounts" ON public.accounts FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  receiver_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  note TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tx select party or admin" ON public.transactions FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete tx" ON public.transactions FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif own select" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif own update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Trigger: auto profile + default account + user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.accounts (user_id, account_name) VALUES (NEW.id, 'Primary Checking');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic transfer RPC
CREATE OR REPLACE FUNCTION public.transfer_funds(_receiver_account TEXT, _amount NUMERIC, _note TEXT DEFAULT NULL)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _sender_acc RECORD;
  _receiver_acc RECORD;
  _tx_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;

  SELECT * INTO _sender_acc FROM public.accounts WHERE user_id = auth.uid() ORDER BY created_at LIMIT 1 FOR UPDATE;
  IF _sender_acc IS NULL THEN RAISE EXCEPTION 'Sender account not found'; END IF;

  SELECT * INTO _receiver_acc FROM public.accounts WHERE account_number = _receiver_account FOR UPDATE;
  IF _receiver_acc IS NULL THEN RAISE EXCEPTION 'Receiver account not found'; END IF;
  IF _receiver_acc.id = _sender_acc.id THEN RAISE EXCEPTION 'Cannot transfer to yourself'; END IF;
  IF _sender_acc.balance < _amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;

  UPDATE public.accounts SET balance = balance - _amount WHERE id = _sender_acc.id;
  UPDATE public.accounts SET balance = balance + _amount WHERE id = _receiver_acc.id;

  INSERT INTO public.transactions (sender_id, receiver_id, sender_account_id, receiver_account_id, amount, note)
  VALUES (auth.uid(), _receiver_acc.user_id, _sender_acc.id, _receiver_acc.id, _amount, _note)
  RETURNING id INTO _tx_id;

  INSERT INTO public.notifications (user_id, message) VALUES
    (auth.uid(), 'Transfer of $' || _amount || ' successful'),
    (_receiver_acc.user_id, 'You received $' || _amount);

  RETURN _tx_id;
END; $$;
