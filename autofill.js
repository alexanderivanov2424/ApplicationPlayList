import {set, get, query} from "./utils.js";
import {getOptions} from "./storageUtils.js";


async function autoFill(){
  const options = await getOptions();
  const fname = options['fname']
  const [tab] = await query({active: true, currentWindow: true});
  const url = tab.url;
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clear').addEventListener('fill', autoFill);
});
