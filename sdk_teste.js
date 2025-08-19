import { VerifySDK } from './public/VerifySDK/VerifySDK.js';
import { setInitialConfig } from './Config.js';

const apiKey = "sk-DEV-29594928-G070_hPDm9C1UujRbBDfeOTnlqs3KZo6UX0Z0ik6ZgiDudoZW0JOkcaLbk1-2i0J";
const workflowId = "6870cdb2ab856262da138cae";
const thirdPartyRef = crypto.randomUUID(); // gera novo ID

let vId = null;
let vm = null;
let verification = null;
let isInitialized = false;

const custumize = () => {
  const cs = VerifySDK.getCustomizationService()
    .setOvalColor("#0dad00")
    .applyCustomization();
}

async function init() {
  showStatus("Inicializando...", "info")
  try {
    setInitialConfig();
    await VerifySDK.initialize(apiKey);
    showStatus("Inicializado com sucesso!", "success")
    vm = await VerifySDK.getVerificationManager(workflowId, thirdPartyRef);
    isInitialized = true;
  } catch (err) {
    console.error(err);
  }
}

async function createVerification() {
  if (!isInitialized){
    showStatus("Não inicializado", "error")
    return;
  }
  if (!vm) {
    return;
  }

  try {
    const verificationId = await vm.createVerification(workflowId, thirdPartyRef);
    vId = verificationId;
    showStatus("Criada com sucesso!", "success")
    console.log("Verificação criada com ID:", verificationId);
  } catch (error) {
    console.error(error);
  }
}

async function getOneVerification() {
  if (!isInitialized){
    showStatus("Não inicializado", "error")
    return;
  }
  if (!vm) {
    showStatus("Verificação ainda não foi criada!", "error")
    return;
  }

  if (!vId) {
    return;
  }

  try {
    verification = await vm.getVerification(vId);
    showStatus("Obtida com sucesso", "success")
    console.log(verification);
  } catch (error) {
    console.error(error);
  }
}

async function startLiveness(){
  if (!isInitialized){
    showStatus("Não inicializado", "error")
    return;
  }
  if (!verification) {
    showStatus("Verificação não foi definida!", "error")
    return;
  }
  try{
    let verificationService = await VerifySDK.getVerificationService();
    verificationService.startLiveness(verification);
  }catch (error) {
    console.error(error);
  }
}

async function startIdScan(){
  if (!isInitialized){
    showStatus("Não inicializado", "error")
    return;
  }
  try{
    let verificationService = await VerifySDK.getVerificationService();
    await verificationService.startIDScan(verification);
    showStatus("Iniciando verificação de ID...", "info");
  }catch (error) {
    console.error(error);
  }
}

async function startEnrollment(){
  if (!isInitialized){
    showStatus("Não inicializado", "error")
    return;
  }
  try{
    let verificationService = await VerifySDK.getVerificationService();
    await verificationService.startEnrollment(verification);
  }catch (error) {
    console.error(error);
  }
}

async function startIdMatch(){
  if (!isInitialized){
    alert("NOT INITIALIZED")
    return;
  }
  try{
    let verificationService = await VerifySDK.getVerificationService();
    await verificationService.startIDMatch(verification);
  }catch (error) {
    console.error(error);
  }
}

function showStatus(message, type = "info") {
  const statusDiv = document.getElementById("status");
  statusDiv.innerHTML = `<p class="${type}">${message}</p>`;
}



window.init = init;
window.startIdMatch = startIdMatch;
window.startEnrollment = startEnrollment;
window.startIdScan = startIdScan;
window.startLiveness = startLiveness;
window.createVerification = createVerification;
window.getOneVerification = getOneVerification;
