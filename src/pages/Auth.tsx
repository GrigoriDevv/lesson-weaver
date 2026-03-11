import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setSuccess('Conta criada! Verifique seu e-mail para confirmar.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, hsl(225, 30%, 8%) 0%, hsl(250, 25%, 12%) 50%, hsl(225, 30%, 8%) 100%)',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'linear-gradient(145deg, hsla(230, 25%, 14%, 0.95), hsla(230, 20%, 10%, 0.98))',
        borderRadius: '20px',
        border: '1px solid hsla(230, 40%, 30%, 0.3)',
        padding: '2.5rem',
        boxShadow: '0 25px 60px -15px hsla(250, 50%, 5%, 0.6)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <BookOpen size={36} color="hsl(250, 85%, 70%)" style={{ marginBottom: '0.75rem' }} />
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, hsl(250, 85%, 75%), hsl(280, 80%, 70%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}>Fazendo Sua Aula</h1>
          <p style={{ color: 'hsla(230, 20%, 65%, 0.8)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'hsla(230, 20%, 55%, 0.6)' }} />
              <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'hsla(230, 20%, 55%, 0.6)' }} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'hsla(230, 20%, 55%, 0.6)' }} />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: 'hsl(0, 70%, 60%)', fontSize: '0.8rem', margin: 0, padding: '0.5rem', background: 'hsla(0, 70%, 60%, 0.1)', borderRadius: '8px' }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: 'hsl(140, 60%, 55%)', fontSize: '0.8rem', margin: 0, padding: '0.5rem', background: 'hsla(140, 60%, 55%, 0.1)', borderRadius: '8px' }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, hsl(250, 70%, 55%), hsl(280, 65%, 50%))',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          color: 'hsla(230, 20%, 55%, 0.7)',
          fontSize: '0.85rem',
          marginTop: '1.5rem',
        }}>
          {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'hsl(250, 85%, 70%)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            {isLogin ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.85rem 0.85rem 0.85rem 2.5rem',
  borderRadius: '12px',
  border: '1px solid hsla(230, 30%, 30%, 0.4)',
  background: 'hsla(230, 25%, 12%, 0.8)',
  color: 'hsl(230, 20%, 85%)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default Auth;
