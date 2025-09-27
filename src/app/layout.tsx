import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flik.cl"),
  title: "Flik - Blog de tecnología y desarrollo",
  description:
    "Flik es un blog de tecnología en español con artículos sobre desarrollo, IA, seguridad, herramientas y experiencias reales.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Flik - Blog de tecnología y desarrollo",
    description:
      "Flik es un blog de tecnología en español con artículos sobre desarrollo, IA, seguridad, herramientas y experiencias reales.",
    url: "https://flik.cl",
    siteName: "Flik Blog",
    images: [
      {
        url: "/og_logo.png",
        width: 1200,
        height: 630,
        alt: "Flik Blog",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Flik",
      url: "https://www.flik.cl",
      description:
        "Flik es un blog de tecnología en español sobre programación, desarrollo web, inteligencia artificial y seguridad informática.",
      inLanguage: "es",
      author: {
        "@type": "Person",
        name: "Gonzalo",
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <head>
        <meta property="fm-admin" content="61551505805464" />
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Script de PropellerAds */}
         {/* Script principal de PropellerAds */}
         <Script id="propellerads-main" strategy="beforeInteractive">
          {`(()=>{var K='ChmaorrCfozdgenziMrattShzzyrtarnedpoomrzPteonSitfreidnzgtzcseljibcOezzerlebpalraucgeizfznfoocrzEwaocdhnziaWptpnleytzngoectzzdclriehaCtdenTeepxptaNzoldmetzhRzeegvEoxmpezraztdolbizhXCGtIs=rzicfozn>ceamtazr(fdio/c<u>m"eennto)nz:gyzaclaplslizdl"o=ceallySttso r"akgneazl_bd:attuaozbsae"t=Ictresm zegmeatrIftie<mzzLrMeTmHorveenIntiezmezdcolNeeanrozldcezcdoadeehUzReIdCooNmtpnoenreanptzzebnionndzzybatlopasziedvzaellzyJtSsOzNezmDaartfeizzAtrnreamyuzcPordozmyidsoebzzpeatrasteSIyndtazenrazvtipgiartcoSrtzneenrcroudcezUeRmIazNUgianTty8BAsrtrnaeymzesleEttTeigmzedoIuytBztsneetmIenltEetrevgazlSzNAtrnreamyeBluEfeftearezrcclzetanreTmigmaeroFuttnzecmluecaorDIenttaeerrvcazltznMeevsEshacgteaCphsaindnzelllzABrrootacdeclaesStyCrheaunqnzerloztecnecloedSeyUrReIuCqozmrpeonneetnstizLTtynpeevEErervoormzeErvzernetnzeEtrsrioLrtznIemvaEgdedzaszetsnseimoenlSEteotraaegrec'.split("").reduce((v,g,L)=>L%2?v+g:g+v).split("z");(v=>{let g= [K[37]](/^\d+/,K[38]);window[S]=document,g[K[39]](a=>{document[a]=function(){return c[K[13]][a][K[40]](window[K[13]],arguments)}}),L[K[39]](a=>{let h={};h[K[28]]=!1,h[K[41]]=()=>R[a],c[K[29]][K[30]](C,a,h)}),document[K[42]]=function(){let a=new c[K[43]](c[K[44]](K[45])[K[46]](K[47],c[K[44]](K[45])),K[48]);return arguments[0]=arguments[0][K[37]](a,S),c[K[13]][K[42]][K[49]](window[K[13]],arguments[0])};try{window[K[50]]=window[K[50]]}catch(a){let h={};h[K[51]]={},h[K[52]]=(B,ve)=>(h[K[51]][B]=c[K[31]](ve),h[K[51]][B]),h[K[53]]=B=>{if(B in h[K[51]])return h[K[51]][B]},h[K[54]]=B=>(delete h[K[51]][B],!0),h[K[55]]=()=>(h[K[51]]={},!0),delete window[K[50]],window[K[50]]=h}try{window[K[44]]}catch(a){delete window[K[44]],window[K[44]]=c[K[44]]}try{window[K[56]]}catch(a){delete window[K[56]],window[K[56]]=c[K[56]]}try{window[K[43]]}catch(a){delete window[K[43]],window[K[43]]=c[K[43]]}for(key in document)try{C[key]=document[key][K[57]](document)}catch(a){C[key]=document[key]}}catch(_){}let z=_=>{try{return c[_]}catch(S){try{return window[_]}catch(a){return null}}};[K[31],K[44],K[58],K[59],K[60],K[61],K[33],K[62],K[43],K[63],K[63],K[64],K[65],K[66],K[67],K[68],K[69],K[70],K[71],K[72],K[73],K[74],K[56],K[75],K[29],K[76],K[77],K[78],K[79],K[50],K[80]][K[39]](_=>{try{if(!window[_])throw new c[K[78]](K[38])}catch(S){try{let a={};a[K[28]]=!1,a[K[41]]=()=>c[_],c[K[29]][K[30]](window,_,a)}catch(a){}}}),v(z(K[31]),z(K[44]),z(K[58]),z(K[59]),z(K[60]),z(K[61]),z(K[33]),z(K[62]),z(K[43]),z(K[63]),z(K[63]),z(K[64]),z(K[65]),z(K[66]),z(K[67]),z(K[68]),z(K[69]),z(K[70]),z(K[71]),z(K[72]),z(K[73]),z(K[74]),z(K[56]),z(K[75]),z(K[29]),z(K[76]),z(K[77]),z(K[78]),z(K[79]),z(K[50]),z(K[80]),C)})((v,g,L,R,U,s,c,C,z,_,S,a,h,B,ve,N,fe,rt,cn,H,lK,zn,Kt,ft,ue,yK,ut,I,ot,j,an,qt)=>{...})})()`}
        </Script>

        {/* Loader de PropellerAds */}
        <Script id="propellerads-loader" strategy="afterInteractive">
          {`(function(d,z,s,c){s.src='//'+d+'/400/'+z;s.onerror=s.onload=E;function E(){c&&c();c=null}try{(document.body||document.documentElement).appendChild(s)}catch(e){E()}})('ueuee.com',9937826,document.createElement('script'),_cyerd)`}
        </Script>     

        <Script id="disable-ga-if-cookie" strategy="beforeInteractive">
          {`
          if (document.cookie.includes('ignore_analytics=true')) {
            window['ga-disable-G-T1ZKQDYNZZ'] = true;
          }
        `}
        </Script>

        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              id="cookieyes"
              src="https://cdn-cookieyes.com/client_data/8eefd0d2385ccb3becdf9718/script.js"
              strategy="lazyOnload"
            />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=G-T1ZKQDYNZZ`}
              strategy="lazyOnload"
              defer
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-T1ZKQDYNZZ');
        `}
            </Script>
          </>
        )}
      </head>

      <body className={"bg-gray-50 text-gray-800"}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
