# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useListMembers, useListPlans, useListPayments, useListCheckIns, useCreateMember, useCreatePlan, useAssignMembership, useRecordPayment, useCreateCheckIn } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useListMembers();

const { data, isPending, isSuccess, isError, error } = useListPlans();

const { data, isPending, isSuccess, isError, error } = useListPayments();

const { data, isPending, isSuccess, isError, error } = useListCheckIns();

const { data, isPending, isSuccess, isError, error } = useCreateMember(createMemberVars);

const { data, isPending, isSuccess, isError, error } = useCreatePlan(createPlanVars);

const { data, isPending, isSuccess, isError, error } = useAssignMembership(assignMembershipVars);

const { data, isPending, isSuccess, isError, error } = useRecordPayment(recordPaymentVars);

const { data, isPending, isSuccess, isError, error } = useCreateCheckIn(createCheckInVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listMembers, listPlans, listPayments, listCheckIns, createMember, createPlan, assignMembership, recordPayment, createCheckIn } from '@dataconnect/generated';


// Operation ListMembers: 
const { data } = await ListMembers(dataConnect);

// Operation ListPlans: 
const { data } = await ListPlans(dataConnect);

// Operation ListPayments: 
const { data } = await ListPayments(dataConnect);

// Operation ListCheckIns: 
const { data } = await ListCheckIns(dataConnect);

// Operation CreateMember:  For variables, look at type CreateMemberVars in ../index.d.ts
const { data } = await CreateMember(dataConnect, createMemberVars);

// Operation CreatePlan:  For variables, look at type CreatePlanVars in ../index.d.ts
const { data } = await CreatePlan(dataConnect, createPlanVars);

// Operation AssignMembership:  For variables, look at type AssignMembershipVars in ../index.d.ts
const { data } = await AssignMembership(dataConnect, assignMembershipVars);

// Operation RecordPayment:  For variables, look at type RecordPaymentVars in ../index.d.ts
const { data } = await RecordPayment(dataConnect, recordPaymentVars);

// Operation CreateCheckIn:  For variables, look at type CreateCheckInVars in ../index.d.ts
const { data } = await CreateCheckIn(dataConnect, createCheckInVars);


```