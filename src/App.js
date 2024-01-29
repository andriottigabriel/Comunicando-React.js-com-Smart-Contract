import { ethers } from 'ethers'; //Comunication Wallet with contract
import { useState } from 'react';
import ABI from './abi.json';
import './App.css';


function App() {

  const [customerId, setCustomerId] =useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");

  const CONTRACT_ADDRESS = "0xE9956c971B72aD74F249E616828df613F03E858b"; // Endereco do Smart Contract 

  async function getProvider(){
    if(!window.ethereum) return setMessage("No Wallet found!");  //verificar se o usario possui uma wallet metamask - (!window.ethereum) verifica se possui uma carteira ativa no navegador*/

    //const provider = new ethers.BrowserProvider.Web3Provider(window.ethereum); // Se tiver uma Wallet, cria um objeto para a conexao */
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []); //Pedir permissao para usuario quando o acesso for a primeira vez */
    if(!accounts || !accounts.length) return setMessage("Wallet not authorized!"); // caso em que usuario nao autorizou

    return provider;

  }

  async function doSearch(){ // funcao que faz a busca na bloackchain */
    


    try{ /*funcionalidade de leitura */
      const provider = await getProvider();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider); //ABI= obj contract saber quais funcoes pode ser chamada -- provider conexao para o contrato */
      const customer = await contract.getCustomer(customerId); // GetCustomer = funcao que existe no contrato puxado pelo ABI 
      //setMessage(JSON.stringify(customer)); 
     // setMessage(JSON.stringify(customer));
      
      const customerData = {
        name: customer.name,
        age: customer.age.toString(),  // Converte BigInt para string
        
      };
    
      setMessage(JSON.stringify(customerData));


    }

    catch(err){
      setMessage(err.message);
    }
  }

  function onSearchClick(){
    setMessage("");
    doSearch();
  }

  async function doSave(){
    try{
      const provider = await getProvider();
      /*const signer = provider.getSigner();*/
      const signer = await provider.getSigner(); 

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const contractSigner = contract.connect (signer); /*permissao para escrever no contrato */

      const tx = await contractSigner.addCustomer({name, age}); /*retorna transacao */
      setMessage(JSON.stringify(tx))
    } catch (err){
      setMessage(err.message);
    }
  }

  function onSaveClick(){
    setMessage("");
    doSave();
  }

  return (
    <div className="App">
      <header className="App-header"> 
        <p> 
          <label>
            Customer ID:
            <input type="number" value = {customerId} onChange={(evt) =>setCustomerId(evt.target.value)}/> 


          </label>
          <input type="button" value= "Search" onClick={onSearchClick} />
          
        </p>

        <hr/>
        <p>
          <label>
            Name: <input type="text" value={name} onChange={(evt) =>setName(evt.target.value)}  />
          </label>
          <label>
            Age: <input type="number" value={age} onChange={(evt) =>setAge(evt.target.value)}  />
          </label>
          <input type="button" value="Save" onClick={onSaveClick} />
        </p>
            
        <p>   
          {message}
        </p>
      </header>
   </div>
  );  
}

export default App;
