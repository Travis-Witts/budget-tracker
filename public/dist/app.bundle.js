!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){var n,o,r,a=[],u=window.indexedDB.open("BudgetDB");function c(){var e=a.reduce((function(e,t){return e+parseInt(t.value)}),0);document.querySelector("#total").textContent=e}function i(){var e=document.querySelector("#tbody");e.innerHTML="",a.forEach((function(t){var n=document.createElement("tr");n.innerHTML="\n      <td>".concat(t.name,"</td>\n      <td>").concat(t.value,"</td>\n    "),e.appendChild(n)}))}function l(){var e=a.slice().reverse(),t=0,o=e.map((function(e){var t=new Date(e.date);return"".concat(t.getMonth()+1,"/").concat(t.getDate(),"/").concat(t.getFullYear())})),r=e.map((function(e){return t+=parseInt(e.value)}));n&&n.destroy();var u=document.getElementById("myChart").getContext("2d");n=new Chart(u,{type:"line",data:{labels:o,datasets:[{label:"Total Over Time",fill:!0,backgroundColor:"#6666ff",data:r}]}})}function d(e){var t=document.querySelector("#t-name"),n=document.querySelector("#t-amount"),o=document.querySelector(".form .error");if(""!==t.value&&""!==n.value){o.textContent="";var r={name:t.value,value:n.value,date:(new Date).toISOString()};e||(r.value*=-1),a.unshift(r),l(),i(),c(),fetch("/api/transaction",{method:"POST",body:JSON.stringify(r),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(e){e.errors?o.textContent="Missing Information":(t.value="",n.value="")})).catch((function(e){f(r),t.value="",n.value=""}))}else o.textContent="Missing Information"}function f(e){r=o.transaction(["BudgetStore"],"readwrite"),r.objectStore("BudgetStore").add(e)}function s(){r=o.transaction(["BudgetStore"],"readwrite");var e=r.objectStore("BudgetStore").getAll();e.onsuccess=function(){e.result.length>0&&fetch("/api/transaction/bulk",{method:"POST",body:JSON.stringify(e.result),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(){r=o.transaction(["BudgetStore"],"readwrite"),r.objectStore("BudgetStore").clear()}))}}fetch("/api/transaction").then((function(e){return e.json()})).then((function(e){a=e,c(),i(),l()})),u.onupgradeneeded=function(e){o=e.target.result,o.createObjectStore("BudgetStore",{autoIncrement:!0})},u.onsuccess=function(e){o=e.target.result,navigator.onLine&&s()},u.onerror=function(e){console.error(e.target.result)},window.addEventListener("online",s),document.querySelector("#add-btn").onclick=function(){d(!0)},document.querySelector("#sub-btn").onclick=function(){d(!1)}}]);