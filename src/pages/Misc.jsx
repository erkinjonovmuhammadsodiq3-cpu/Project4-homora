import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {FiArrowRight,FiEye,FiEyeOff,FiHome} from 'react-icons/fi';
import {Heading} from '../components/ui';
import {useAuth} from '../context/AppContexts';

export function Login({register}){
  const {login,user,logout}=useAuth(),navigate=useNavigate();
  const [name,setName]=useState(''),[identifier,setIdentifier]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState('');
  const [showPassword,setShowPassword]=useState(false),[remember,setRemember]=useState(true),[notice,setNotice]=useState('');
  const submit=event=>{event.preventDefault();setNotice('');if(register&&password!==confirm){setNotice('Passwords do not match.');return}login(identifier.trim(),name.trim()||undefined,remember);navigate('/projects')};
  const demoLogin=()=>{login('google@demo.homora','Homeowner');navigate('/projects')};
  if(user)return <div className="auth-shell mx-auto my-10 max-w-6xl overflow-hidden rounded-xl border border-stone/40"><section className="auth-art"><div className="relative z-10"><FiHome className="text-3xl"/><p className="mt-8 text-xs uppercase tracking-[.2em]">Your HOMORA account</p><h1 className="mt-3 font-display text-5xl">Welcome home,<br/>{user.name}.</h1></div></section><section className="flex flex-col justify-center p-8 md:p-12"><p className="text-sm text-stone">Your saved projects, shopping bag and order history are ready.</p><Link to="/projects" className="btn btn-dark mt-6 w-fit">Open my projects <FiArrowRight className="ml-2"/></Link><button className="mt-5 w-fit text-sm underline" onClick={logout}>Sign out</button></section></div>;
  return <div className="auth-shell mx-auto my-8 grid max-w-6xl overflow-hidden rounded-xl border border-stone/40 md:my-12 md:grid-cols-[.9fr_1.1fr]">
    <section className="auth-art flex min-h-64 flex-col justify-between p-7 text-warm md:min-h-[660px] md:p-10"><div className="relative z-10 flex items-center gap-3"><FiHome/><span className="font-display text-sm tracking-[.25em]">HOMORA</span></div><div className="relative z-10 mb-2"><p className="text-[10px] uppercase tracking-[.22em] text-warm/70">A better way to make a home</p><h1 className="mt-3 max-w-sm font-display text-4xl leading-tight md:text-5xl">Every detail starts with a decision.</h1><p className="mt-4 max-w-sm text-sm leading-6 text-warm/75">Keep your projects, saved pieces and plans together in one thoughtful place.</p></div><span className="auth-coordinate relative z-10">H · 40°42' · HOME</span></section>
    <section className="flex flex-col justify-center px-6 py-9 sm:px-10 md:px-14 md:py-14"><p className="text-[10px] uppercase tracking-[.2em] text-accent">{register?'CREATE YOUR ACCOUNT':'YOUR HOME, IN PROGRESS'}</p><h2 className="mt-2 font-display text-4xl">{register?'Join HOMORA':'Welcome back'}</h2><p className="mt-2 text-sm text-stone">{register?'Save your ideas and keep every project moving.':'Sign in to continue where you left off.'}</p>
      <button type="button" onClick={demoLogin} className="auth-social mt-7 flex w-full items-center justify-center gap-3 border border-stone/60 px-4 py-3 text-sm transition hover:border-char hover:bg-beige/40"><span className="grid h-5 w-5 place-items-center rounded-full border border-stone text-[11px] font-semibold">G</span>Continue with Google <span className="text-[10px] text-stone">DEMO</span></button>
      <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-widest text-stone"><span className="h-px flex-1 bg-stone/50"/>or use your details<span className="h-px flex-1 bg-stone/50"/></div>
      <form onSubmit={submit} className="grid gap-4">
        {register&&<label className="grid gap-1.5 text-xs">Full name<input required value={name} onChange={event=>setName(event.target.value)} autoComplete="name" placeholder="Your name" className="auth-input"/></label>}
        <label className="grid gap-1.5 text-xs">Email or phone<input required value={identifier} onChange={event=>setIdentifier(event.target.value)} autoComplete="username" placeholder="you@example.com or +1 555 000 0000" className="auth-input"/></label>
        <label className="grid gap-1.5 text-xs">Password<span className="auth-password"><input required minLength={8} type={showPassword?'text':'password'} value={password} onChange={event=>setPassword(event.target.value)} autoComplete={register?'new-password':'current-password'} placeholder="At least 8 characters" className="auth-input"/><button type="button" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<FiEyeOff/>:<FiEye/>}</button></span></label>
        {register&&<label className="grid gap-1.5 text-xs">Confirm password<input required minLength={8} type={showPassword?'text':'password'} value={confirm} onChange={event=>setConfirm(event.target.value)} autoComplete="new-password" placeholder="Enter your password again" className="auth-input"/></label>}
        {!register&&<div className="flex items-center justify-between gap-3 text-xs"><label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={event=>setRemember(event.target.checked)}/> Keep me signed in</label><button type="button" onClick={()=>setNotice('Password recovery is a demo here. Connect an email or SMS service to send a reset link.')} className="underline underline-offset-4">Forgot password?</button></div>}
        {notice&&<p role="status" className="text-xs text-accent">{notice}</p>}
        <button className="btn btn-dark mt-1 w-full">{register?'Create account':'Sign in'} <FiArrowRight className="ml-2"/></button>
      </form>
      <p className="mt-6 text-center text-xs text-stone">{register?'Already have an account?':'New to HOMORA?'} <Link className="font-medium text-char underline underline-offset-4" to={register?'/login':'/register'}>{register?'Sign in':'Create an account'}</Link></p>
      <p className="mt-6 text-center text-[10px] leading-5 text-stone">Prototype sign-in is stored on this device only. Google and password recovery are demo interactions.</p>
    </section>
  </div>;
}

export const Module=({name})=><div className="mx-auto max-w-5xl px-5 py-24"><Heading k="Coming next">{name.replace('-',' ')}</Heading><p className="text-stone">Bu modul keyingi bosqichda to'ldiriladi (marshrut va layout tayyor).</p></div>;