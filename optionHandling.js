import {set, get} from "./storageUtils.js";

const FIELDS = ["fname","lname"]

async function saveOptions(){
  let options = {}
  for(const key of FIELDS){
    options[key] = document.getElementById(key).value
  }
  console.log(options);
  await set({"options": options});
}

export async function getOptions(){
  return (await get("options"))["options"];
}

async function loadOptions(){
  const options = (await get("options"))["options"];
  console.log(options);
  for(const key of FIELDS){
    document.getElementById(key).value = options[key]
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('save_opp').addEventListener('click', saveOptions);
});

window.onload = loadOptions;
