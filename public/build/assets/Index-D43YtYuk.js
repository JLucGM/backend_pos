const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/DataTable-DP_nnpuO.js","assets/app-lsv2Jge4.js","assets/app-DoXMhKli.css","assets/TextInput-B9YmD9qe.js","assets/button-YtXII3No.js","assets/index-DdzSTFpA.js","assets/index-Cb8geMzt.js","assets/utils-Dj5kSLHa.js","assets/table-DQDRQtX1.js","assets/use-tab-direction-D1AScHKy.js","assets/index-Dg9TEIYg.js","assets/floating-ui.dom-D83--fCt.js","assets/AuthenticatedLayout-BinVKHdM.js","assets/input-K5LkVRdE.js","assets/avatar-o2MULCTV.js","assets/createLucideIcon-Dn6WtznC.js","assets/index-CpF7Rmvm.js","assets/TrashIcon-BocU-KxJ.js"])))=>i.map(i=>d[i]);
import{j as e,S as i,r as a,x as o,_ as m}from"./app-lsv2Jge4.js";import{A as n}from"./AuthenticatedLayout-BinVKHdM.js";import{b as c}from"./button-YtXII3No.js";import d from"./div-section-DLiKdBKj.js";import{StocksColumns as l}from"./Columns-Bsrt0bws.js";import{L as x}from"./loader-D9WXvQLP.js";import{P as p,F as u}from"./ShoppingBagIcon-Crd2MkaJ.js";import"./index-DdzSTFpA.js";import"./index-Cb8geMzt.js";import"./utils-Dj5kSLHa.js";import"./input-K5LkVRdE.js";import"./avatar-o2MULCTV.js";import"./index-Dg9TEIYg.js";import"./createLucideIcon-Dn6WtznC.js";import"./floating-ui.dom-D83--fCt.js";import"./index-CpF7Rmvm.js";import"./badge-B2L5cutD.js";const f=a.lazy(()=>m(()=>import("./DataTable-DP_nnpuO.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17])));function w({stock:t,permission:s}){return e.jsxs(n,{header:e.jsx("div",{className:"flex justify-between items-center",children:e.jsx("h2",{className:"capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight",children:"Inventarios"})}),children:[e.jsx(i,{className:"capitalize",title:"Inventarios"}),e.jsx(d,{children:e.jsx(a.Suspense,{fallback:e.jsx(x,{}),children:t.length>0?e.jsx(f,{columns:l,data:t,routeEdit:"stocks.edit",routeDestroy:"stocks.destroy",editPermission:"admin.stocks.edit",deletePermission:"admin.stocks.delete",permissions:s}):e.jsxs("div",{className:"flex justify-between text-start px-8 py-16",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-500",children:"Añade tus productos"}),e.jsx("p",{className:"text-sm text-gray-500",children:"Comience por abastecer su tienda con productos que les encantarán a sus clientes."}),s.some(r=>r.name==="admin.products.create")&&e.jsxs(o,{className:c({variant:"default",size:"sm"}),href:route("products.create"),children:[e.jsx(p,{className:"size-4"}),"Añadir un producto"]})]}),e.jsx(u,{className:"size-10"})]})})})]})}export{w as default};
