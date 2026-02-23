export function loadUXtweak(): void {
  if (window.location.hostname === "localhost") return;
  if (document.getElementById("uxtweak-script")) return;

  const script = document.createElement("script");
  script.id = "uxtweak-script";
  script.type = "text/javascript";
  script.text = `(function(u,x,t,w,e,a,k,s){a=function(v){try{u.setItem(t+e,v)}catch(e){}v=JSON.parse(v);for(k=0;k<v.length;k++){s=x.createElement("script");s.text="(function(u,x,t,w,e,a,k){a=u[e]=function(){a.q.push(arguments)};a.q=[];a.t=+new Date;a.c=w;k=x.createElement('script');k.async=1;k.src=t;x.getElementsByTagName('head')[0].appendChild(k)})(window,document,'"+v[k].u+"',"+JSON.stringify(v[k].c)+",'"+v[k].g+"')";x.getElementsByTagName("head")[0].appendChild(s)}};try{k=u.getItem(t+e)}catch(e){}if(k){return a(k)}k=new XMLHttpRequest;k.onreadystatechange=function(){if(k.readyState==4&&k.status==200)a(k.responseText)};k.open("POST",w+e);k.send(x.URL)})(sessionStorage,document,"uxt:","https://api.uxtweak.com/snippet/","7356cea4-1eb4-4e36-9944-5a76303aa6fe");`;
  document.head.appendChild(script);
}
