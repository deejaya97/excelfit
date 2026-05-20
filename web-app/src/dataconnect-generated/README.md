# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListMembers*](#listmembers)
  - [*ListPlans*](#listplans)
  - [*ListPayments*](#listpayments)
  - [*ListCheckIns*](#listcheckins)
- [**Mutations**](#mutations)
  - [*CreateMember*](#createmember)
  - [*CreatePlan*](#createplan)
  - [*AssignMembership*](#assignmembership)
  - [*RecordPayment*](#recordpayment)
  - [*CreateCheckIn*](#createcheckin)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListMembers
You can execute the `ListMembers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMembers(options?: ExecuteQueryOptions): QueryPromise<ListMembersData, undefined>;

interface ListMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMembersData, undefined>;
}
export const listMembersRef: ListMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMembers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMembersData, undefined>;

interface ListMembersRef {
  ...
  (dc: DataConnect): QueryRef<ListMembersData, undefined>;
}
export const listMembersRef: ListMembersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMembersRef:
```typescript
const name = listMembersRef.operationName;
console.log(name);
```

### Variables
The `ListMembers` query has no variables.
### Return Type
Recall that executing the `ListMembers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMembersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMembersData {
  members: ({
    id: UUIDString;
    memberCode: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string | null;
    emergencyContact?: string | null;
    status: string;
    joinedOn: DateString;
    notes?: string | null;
    memberships_on_member: ({
      id: UUIDString;
      startDate: DateString;
      endDate: DateString;
      status: string;
      plan: {
        id: UUIDString;
        name: string;
        price: number;
        durationDays: number;
      } & MembershipPlan_Key;
    } & Membership_Key)[];
  } & Member_Key)[];
}
```
### Using `ListMembers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMembers } from '@dataconnect/generated';


// Call the `listMembers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMembers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMembers(dataConnect);

console.log(data.members);

// Or, you can use the `Promise` API.
listMembers().then((response) => {
  const data = response.data;
  console.log(data.members);
});
```

### Using `ListMembers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMembersRef } from '@dataconnect/generated';


// Call the `listMembersRef()` function to get a reference to the query.
const ref = listMembersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMembersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.members);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.members);
});
```

## ListPlans
You can execute the `ListPlans` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPlans(options?: ExecuteQueryOptions): QueryPromise<ListPlansData, undefined>;

interface ListPlansRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPlansData, undefined>;
}
export const listPlansRef: ListPlansRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPlans(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPlansData, undefined>;

interface ListPlansRef {
  ...
  (dc: DataConnect): QueryRef<ListPlansData, undefined>;
}
export const listPlansRef: ListPlansRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPlansRef:
```typescript
const name = listPlansRef.operationName;
console.log(name);
```

### Variables
The `ListPlans` query has no variables.
### Return Type
Recall that executing the `ListPlans` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPlansData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPlansData {
  membershipPlans: ({
    id: UUIDString;
    name: string;
    durationDays: number;
    price: number;
    benefits?: string | null;
    active: boolean;
  } & MembershipPlan_Key)[];
}
```
### Using `ListPlans`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPlans } from '@dataconnect/generated';


// Call the `listPlans()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPlans();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPlans(dataConnect);

console.log(data.membershipPlans);

// Or, you can use the `Promise` API.
listPlans().then((response) => {
  const data = response.data;
  console.log(data.membershipPlans);
});
```

### Using `ListPlans`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPlansRef } from '@dataconnect/generated';


// Call the `listPlansRef()` function to get a reference to the query.
const ref = listPlansRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPlansRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.membershipPlans);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.membershipPlans);
});
```

## ListPayments
You can execute the `ListPayments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPayments(options?: ExecuteQueryOptions): QueryPromise<ListPaymentsData, undefined>;

interface ListPaymentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPaymentsData, undefined>;
}
export const listPaymentsRef: ListPaymentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPayments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsData, undefined>;

interface ListPaymentsRef {
  ...
  (dc: DataConnect): QueryRef<ListPaymentsData, undefined>;
}
export const listPaymentsRef: ListPaymentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPaymentsRef:
```typescript
const name = listPaymentsRef.operationName;
console.log(name);
```

### Variables
The `ListPayments` query has no variables.
### Return Type
Recall that executing the `ListPayments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPaymentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPaymentsData {
  payments: ({
    id: UUIDString;
    amount: number;
    method: string;
    paidOn: DateString;
    reference?: string | null;
    notes?: string | null;
    invoiceNumber: string;
    member: {
      id: UUIDString;
      memberCode: string;
      firstName: string;
      lastName: string;
    } & Member_Key;
      membership?: {
        id: UUIDString;
        startDate: DateString;
        endDate: DateString;
        plan: {
          id: UUIDString;
          name: string;
        } & MembershipPlan_Key;
      } & Membership_Key;
  } & Payment_Key)[];
}
```
### Using `ListPayments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPayments } from '@dataconnect/generated';


// Call the `listPayments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPayments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPayments(dataConnect);

console.log(data.payments);

// Or, you can use the `Promise` API.
listPayments().then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `ListPayments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPaymentsRef } from '@dataconnect/generated';


// Call the `listPaymentsRef()` function to get a reference to the query.
const ref = listPaymentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPaymentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## ListCheckIns
You can execute the `ListCheckIns` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCheckIns(options?: ExecuteQueryOptions): QueryPromise<ListCheckInsData, undefined>;

interface ListCheckInsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCheckInsData, undefined>;
}
export const listCheckInsRef: ListCheckInsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCheckIns(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCheckInsData, undefined>;

interface ListCheckInsRef {
  ...
  (dc: DataConnect): QueryRef<ListCheckInsData, undefined>;
}
export const listCheckInsRef: ListCheckInsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCheckInsRef:
```typescript
const name = listCheckInsRef.operationName;
console.log(name);
```

### Variables
The `ListCheckIns` query has no variables.
### Return Type
Recall that executing the `ListCheckIns` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCheckInsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCheckInsData {
  checkIns: ({
    id: UUIDString;
    checkedInAt: TimestampString;
    status: string;
    message: string;
    member: {
      id: UUIDString;
      memberCode: string;
      firstName: string;
      lastName: string;
    } & Member_Key;
  } & CheckIn_Key)[];
}
```
### Using `ListCheckIns`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCheckIns } from '@dataconnect/generated';


// Call the `listCheckIns()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCheckIns();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCheckIns(dataConnect);

console.log(data.checkIns);

// Or, you can use the `Promise` API.
listCheckIns().then((response) => {
  const data = response.data;
  console.log(data.checkIns);
});
```

### Using `ListCheckIns`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCheckInsRef } from '@dataconnect/generated';


// Call the `listCheckInsRef()` function to get a reference to the query.
const ref = listCheckInsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCheckInsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.checkIns);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.checkIns);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateMember
You can execute the `CreateMember` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMember(vars: CreateMemberVariables): MutationPromise<CreateMemberData, CreateMemberVariables>;

interface CreateMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMemberVariables): MutationRef<CreateMemberData, CreateMemberVariables>;
}
export const createMemberRef: CreateMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMember(dc: DataConnect, vars: CreateMemberVariables): MutationPromise<CreateMemberData, CreateMemberVariables>;

interface CreateMemberRef {
  ...
  (dc: DataConnect, vars: CreateMemberVariables): MutationRef<CreateMemberData, CreateMemberVariables>;
}
export const createMemberRef: CreateMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMemberRef:
```typescript
const name = createMemberRef.operationName;
console.log(name);
```

### Variables
The `CreateMember` mutation requires an argument of type `CreateMemberVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMemberVariables {
  memberCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  emergencyContact?: string | null;
  joinedOn: DateString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateMember` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMemberData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMemberData {
  member_insert: Member_Key;
}
```
### Using `CreateMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMember, CreateMemberVariables } from '@dataconnect/generated';

// The `CreateMember` mutation requires an argument of type `CreateMemberVariables`:
const createMemberVars: CreateMemberVariables = {
  memberCode: ..., 
  firstName: ..., 
  lastName: ..., 
  phone: ..., 
  email: ..., // optional
  emergencyContact: ..., // optional
  joinedOn: ..., 
  notes: ..., // optional
};

// Call the `createMember()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMember(createMemberVars);
// Variables can be defined inline as well.
const { data } = await createMember({ memberCode: ..., firstName: ..., lastName: ..., phone: ..., email: ..., emergencyContact: ..., joinedOn: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMember(dataConnect, createMemberVars);

console.log(data.member_insert);

// Or, you can use the `Promise` API.
createMember(createMemberVars).then((response) => {
  const data = response.data;
  console.log(data.member_insert);
});
```

### Using `CreateMember`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMemberRef, CreateMemberVariables } from '@dataconnect/generated';

// The `CreateMember` mutation requires an argument of type `CreateMemberVariables`:
const createMemberVars: CreateMemberVariables = {
  memberCode: ..., 
  firstName: ..., 
  lastName: ..., 
  phone: ..., 
  email: ..., // optional
  emergencyContact: ..., // optional
  joinedOn: ..., 
  notes: ..., // optional
};

// Call the `createMemberRef()` function to get a reference to the mutation.
const ref = createMemberRef(createMemberVars);
// Variables can be defined inline as well.
const ref = createMemberRef({ memberCode: ..., firstName: ..., lastName: ..., phone: ..., email: ..., emergencyContact: ..., joinedOn: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMemberRef(dataConnect, createMemberVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.member_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.member_insert);
});
```

## CreatePlan
You can execute the `CreatePlan` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPlan(vars: CreatePlanVariables): MutationPromise<CreatePlanData, CreatePlanVariables>;

interface CreatePlanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePlanVariables): MutationRef<CreatePlanData, CreatePlanVariables>;
}
export const createPlanRef: CreatePlanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPlan(dc: DataConnect, vars: CreatePlanVariables): MutationPromise<CreatePlanData, CreatePlanVariables>;

interface CreatePlanRef {
  ...
  (dc: DataConnect, vars: CreatePlanVariables): MutationRef<CreatePlanData, CreatePlanVariables>;
}
export const createPlanRef: CreatePlanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPlanRef:
```typescript
const name = createPlanRef.operationName;
console.log(name);
```

### Variables
The `CreatePlan` mutation requires an argument of type `CreatePlanVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePlanVariables {
  name: string;
  durationDays: number;
  price: number;
  benefits?: string | null;
}
```
### Return Type
Recall that executing the `CreatePlan` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePlanData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePlanData {
  membershipPlan_insert: MembershipPlan_Key;
}
```
### Using `CreatePlan`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPlan, CreatePlanVariables } from '@dataconnect/generated';

// The `CreatePlan` mutation requires an argument of type `CreatePlanVariables`:
const createPlanVars: CreatePlanVariables = {
  name: ..., 
  durationDays: ..., 
  price: ..., 
  benefits: ..., // optional
};

// Call the `createPlan()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPlan(createPlanVars);
// Variables can be defined inline as well.
const { data } = await createPlan({ name: ..., durationDays: ..., price: ..., benefits: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPlan(dataConnect, createPlanVars);

console.log(data.membershipPlan_insert);

// Or, you can use the `Promise` API.
createPlan(createPlanVars).then((response) => {
  const data = response.data;
  console.log(data.membershipPlan_insert);
});
```

### Using `CreatePlan`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPlanRef, CreatePlanVariables } from '@dataconnect/generated';

// The `CreatePlan` mutation requires an argument of type `CreatePlanVariables`:
const createPlanVars: CreatePlanVariables = {
  name: ..., 
  durationDays: ..., 
  price: ..., 
  benefits: ..., // optional
};

// Call the `createPlanRef()` function to get a reference to the mutation.
const ref = createPlanRef(createPlanVars);
// Variables can be defined inline as well.
const ref = createPlanRef({ name: ..., durationDays: ..., price: ..., benefits: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPlanRef(dataConnect, createPlanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.membershipPlan_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.membershipPlan_insert);
});
```

## AssignMembership
You can execute the `AssignMembership` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
assignMembership(vars: AssignMembershipVariables): MutationPromise<AssignMembershipData, AssignMembershipVariables>;

interface AssignMembershipRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignMembershipVariables): MutationRef<AssignMembershipData, AssignMembershipVariables>;
}
export const assignMembershipRef: AssignMembershipRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignMembership(dc: DataConnect, vars: AssignMembershipVariables): MutationPromise<AssignMembershipData, AssignMembershipVariables>;

interface AssignMembershipRef {
  ...
  (dc: DataConnect, vars: AssignMembershipVariables): MutationRef<AssignMembershipData, AssignMembershipVariables>;
}
export const assignMembershipRef: AssignMembershipRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignMembershipRef:
```typescript
const name = assignMembershipRef.operationName;
console.log(name);
```

### Variables
The `AssignMembership` mutation requires an argument of type `AssignMembershipVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AssignMembershipVariables {
  memberId: UUIDString;
  planId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}
```
### Return Type
Recall that executing the `AssignMembership` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignMembershipData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignMembershipData {
  membership_updateMany: number;
  membership_insert: Membership_Key;
}
```
### Using `AssignMembership`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignMembership, AssignMembershipVariables } from '@dataconnect/generated';

// The `AssignMembership` mutation requires an argument of type `AssignMembershipVariables`:
const assignMembershipVars: AssignMembershipVariables = {
  memberId: ..., 
  planId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `assignMembership()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignMembership(assignMembershipVars);
// Variables can be defined inline as well.
const { data } = await assignMembership({ memberId: ..., planId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignMembership(dataConnect, assignMembershipVars);

console.log(data.membership_updateMany);
console.log(data.membership_insert);

// Or, you can use the `Promise` API.
assignMembership(assignMembershipVars).then((response) => {
  const data = response.data;
  console.log(data.membership_updateMany);
  console.log(data.membership_insert);
});
```

### Using `AssignMembership`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignMembershipRef, AssignMembershipVariables } from '@dataconnect/generated';

// The `AssignMembership` mutation requires an argument of type `AssignMembershipVariables`:
const assignMembershipVars: AssignMembershipVariables = {
  memberId: ..., 
  planId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `assignMembershipRef()` function to get a reference to the mutation.
const ref = assignMembershipRef(assignMembershipVars);
// Variables can be defined inline as well.
const ref = assignMembershipRef({ memberId: ..., planId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignMembershipRef(dataConnect, assignMembershipVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.membership_updateMany);
console.log(data.membership_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.membership_updateMany);
  console.log(data.membership_insert);
});
```

## RecordPayment
You can execute the `RecordPayment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
recordPayment(vars: RecordPaymentVariables): MutationPromise<RecordPaymentData, RecordPaymentVariables>;

interface RecordPaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordPaymentVariables): MutationRef<RecordPaymentData, RecordPaymentVariables>;
}
export const recordPaymentRef: RecordPaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordPayment(dc: DataConnect, vars: RecordPaymentVariables): MutationPromise<RecordPaymentData, RecordPaymentVariables>;

interface RecordPaymentRef {
  ...
  (dc: DataConnect, vars: RecordPaymentVariables): MutationRef<RecordPaymentData, RecordPaymentVariables>;
}
export const recordPaymentRef: RecordPaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordPaymentRef:
```typescript
const name = recordPaymentRef.operationName;
console.log(name);
```

### Variables
The `RecordPayment` mutation requires an argument of type `RecordPaymentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordPaymentVariables {
  memberId: UUIDString;
  membershipId?: UUIDString | null;
  amount: number;
  method: string;
  paidOn: DateString;
  reference?: string | null;
  notes?: string | null;
  invoiceNumber: string;
}
```
### Return Type
Recall that executing the `RecordPayment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordPaymentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordPaymentData {
  payment_insert: Payment_Key;
}
```
### Using `RecordPayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordPayment, RecordPaymentVariables } from '@dataconnect/generated';

// The `RecordPayment` mutation requires an argument of type `RecordPaymentVariables`:
const recordPaymentVars: RecordPaymentVariables = {
  memberId: ..., 
  membershipId: ..., // optional
  amount: ..., 
  method: ..., 
  paidOn: ..., 
  reference: ..., // optional
  notes: ..., // optional
  invoiceNumber: ..., 
};

// Call the `recordPayment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordPayment(recordPaymentVars);
// Variables can be defined inline as well.
const { data } = await recordPayment({ memberId: ..., membershipId: ..., amount: ..., method: ..., paidOn: ..., reference: ..., notes: ..., invoiceNumber: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordPayment(dataConnect, recordPaymentVars);

console.log(data.payment_insert);

// Or, you can use the `Promise` API.
recordPayment(recordPaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment_insert);
});
```

### Using `RecordPayment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordPaymentRef, RecordPaymentVariables } from '@dataconnect/generated';

// The `RecordPayment` mutation requires an argument of type `RecordPaymentVariables`:
const recordPaymentVars: RecordPaymentVariables = {
  memberId: ..., 
  membershipId: ..., // optional
  amount: ..., 
  method: ..., 
  paidOn: ..., 
  reference: ..., // optional
  notes: ..., // optional
  invoiceNumber: ..., 
};

// Call the `recordPaymentRef()` function to get a reference to the mutation.
const ref = recordPaymentRef(recordPaymentVars);
// Variables can be defined inline as well.
const ref = recordPaymentRef({ memberId: ..., membershipId: ..., amount: ..., method: ..., paidOn: ..., reference: ..., notes: ..., invoiceNumber: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordPaymentRef(dataConnect, recordPaymentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_insert);
});
```

## CreateCheckIn
You can execute the `CreateCheckIn` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCheckIn(vars: CreateCheckInVariables): MutationPromise<CreateCheckInData, CreateCheckInVariables>;

interface CreateCheckInRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCheckInVariables): MutationRef<CreateCheckInData, CreateCheckInVariables>;
}
export const createCheckInRef: CreateCheckInRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCheckIn(dc: DataConnect, vars: CreateCheckInVariables): MutationPromise<CreateCheckInData, CreateCheckInVariables>;

interface CreateCheckInRef {
  ...
  (dc: DataConnect, vars: CreateCheckInVariables): MutationRef<CreateCheckInData, CreateCheckInVariables>;
}
export const createCheckInRef: CreateCheckInRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCheckInRef:
```typescript
const name = createCheckInRef.operationName;
console.log(name);
```

### Variables
The `CreateCheckIn` mutation requires an argument of type `CreateCheckInVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCheckInVariables {
  memberId: UUIDString;
  status: string;
  message: string;
}
```
### Return Type
Recall that executing the `CreateCheckIn` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCheckInData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCheckInData {
  checkIn_insert: CheckIn_Key;
}
```
### Using `CreateCheckIn`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCheckIn, CreateCheckInVariables } from '@dataconnect/generated';

// The `CreateCheckIn` mutation requires an argument of type `CreateCheckInVariables`:
const createCheckInVars: CreateCheckInVariables = {
  memberId: ..., 
  status: ..., 
  message: ..., 
};

// Call the `createCheckIn()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCheckIn(createCheckInVars);
// Variables can be defined inline as well.
const { data } = await createCheckIn({ memberId: ..., status: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCheckIn(dataConnect, createCheckInVars);

console.log(data.checkIn_insert);

// Or, you can use the `Promise` API.
createCheckIn(createCheckInVars).then((response) => {
  const data = response.data;
  console.log(data.checkIn_insert);
});
```

### Using `CreateCheckIn`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCheckInRef, CreateCheckInVariables } from '@dataconnect/generated';

// The `CreateCheckIn` mutation requires an argument of type `CreateCheckInVariables`:
const createCheckInVars: CreateCheckInVariables = {
  memberId: ..., 
  status: ..., 
  message: ..., 
};

// Call the `createCheckInRef()` function to get a reference to the mutation.
const ref = createCheckInRef(createCheckInVars);
// Variables can be defined inline as well.
const ref = createCheckInRef({ memberId: ..., status: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCheckInRef(dataConnect, createCheckInVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.checkIn_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.checkIn_insert);
});
```

