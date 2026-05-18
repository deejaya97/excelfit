const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'excelfit',
  location: 'us-east1'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const listMembersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMembers');
}
listMembersRef.operationName = 'ListMembers';
exports.listMembersRef = listMembersRef;

exports.listMembers = function listMembers(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMembersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listPlansRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPlans');
}
listPlansRef.operationName = 'ListPlans';
exports.listPlansRef = listPlansRef;

exports.listPlans = function listPlans(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPlansRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listPaymentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPayments');
}
listPaymentsRef.operationName = 'ListPayments';
exports.listPaymentsRef = listPaymentsRef;

exports.listPayments = function listPayments(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPaymentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listCheckInsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCheckIns');
}
listCheckInsRef.operationName = 'ListCheckIns';
exports.listCheckInsRef = listCheckInsRef;

exports.listCheckIns = function listCheckIns(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listCheckInsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createMemberRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMember', inputVars);
}
createMemberRef.operationName = 'CreateMember';
exports.createMemberRef = createMemberRef;

exports.createMember = function createMember(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createMemberRef(dcInstance, inputVars));
}
;

const createPlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePlan', inputVars);
}
createPlanRef.operationName = 'CreatePlan';
exports.createPlanRef = createPlanRef;

exports.createPlan = function createPlan(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPlanRef(dcInstance, inputVars));
}
;

const assignMembershipRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignMembership', inputVars);
}
assignMembershipRef.operationName = 'AssignMembership';
exports.assignMembershipRef = assignMembershipRef;

exports.assignMembership = function assignMembership(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(assignMembershipRef(dcInstance, inputVars));
}
;

const recordPaymentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordPayment', inputVars);
}
recordPaymentRef.operationName = 'RecordPayment';
exports.recordPaymentRef = recordPaymentRef;

exports.recordPayment = function recordPayment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(recordPaymentRef(dcInstance, inputVars));
}
;

const createCheckInRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCheckIn', inputVars);
}
createCheckInRef.operationName = 'CreateCheckIn';
exports.createCheckInRef = createCheckInRef;

exports.createCheckIn = function createCheckIn(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCheckInRef(dcInstance, inputVars));
}
;
