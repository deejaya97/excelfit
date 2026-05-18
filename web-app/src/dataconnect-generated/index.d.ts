import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AssignMembershipData {
  membership_updateMany: number;
  membership_insert: Membership_Key;
}

export interface AssignMembershipVariables {
  memberId: UUIDString;
  planId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}

export interface CheckIn_Key {
  id: UUIDString;
  __typename?: 'CheckIn_Key';
}

export interface CreateCheckInData {
  checkIn_insert: CheckIn_Key;
}

export interface CreateCheckInVariables {
  memberId: UUIDString;
  status: string;
  message: string;
}

export interface CreateMemberData {
  member_insert: Member_Key;
}

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

export interface CreatePlanData {
  membershipPlan_insert: MembershipPlan_Key;
}

export interface CreatePlanVariables {
  name: string;
  durationDays: number;
  price: number;
  benefits?: string | null;
}

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

export interface Member_Key {
  id: UUIDString;
  __typename?: 'Member_Key';
}

export interface MembershipPlan_Key {
  id: UUIDString;
  __typename?: 'MembershipPlan_Key';
}

export interface Membership_Key {
  id: UUIDString;
  __typename?: 'Membership_Key';
}

export interface Payment_Key {
  id: UUIDString;
  __typename?: 'Payment_Key';
}

export interface RecordPaymentData {
  payment_insert: Payment_Key;
}

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

interface ListMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMembersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMembersData, undefined>;
  operationName: string;
}
export const listMembersRef: ListMembersRef;

export function listMembers(options?: ExecuteQueryOptions): QueryPromise<ListMembersData, undefined>;
export function listMembers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMembersData, undefined>;

interface ListPlansRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPlansData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPlansData, undefined>;
  operationName: string;
}
export const listPlansRef: ListPlansRef;

export function listPlans(options?: ExecuteQueryOptions): QueryPromise<ListPlansData, undefined>;
export function listPlans(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPlansData, undefined>;

interface ListPaymentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPaymentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPaymentsData, undefined>;
  operationName: string;
}
export const listPaymentsRef: ListPaymentsRef;

export function listPayments(options?: ExecuteQueryOptions): QueryPromise<ListPaymentsData, undefined>;
export function listPayments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsData, undefined>;

interface ListCheckInsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCheckInsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCheckInsData, undefined>;
  operationName: string;
}
export const listCheckInsRef: ListCheckInsRef;

export function listCheckIns(options?: ExecuteQueryOptions): QueryPromise<ListCheckInsData, undefined>;
export function listCheckIns(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCheckInsData, undefined>;

interface CreateMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMemberVariables): MutationRef<CreateMemberData, CreateMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMemberVariables): MutationRef<CreateMemberData, CreateMemberVariables>;
  operationName: string;
}
export const createMemberRef: CreateMemberRef;

export function createMember(vars: CreateMemberVariables): MutationPromise<CreateMemberData, CreateMemberVariables>;
export function createMember(dc: DataConnect, vars: CreateMemberVariables): MutationPromise<CreateMemberData, CreateMemberVariables>;

interface CreatePlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePlanVariables): MutationRef<CreatePlanData, CreatePlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePlanVariables): MutationRef<CreatePlanData, CreatePlanVariables>;
  operationName: string;
}
export const createPlanRef: CreatePlanRef;

export function createPlan(vars: CreatePlanVariables): MutationPromise<CreatePlanData, CreatePlanVariables>;
export function createPlan(dc: DataConnect, vars: CreatePlanVariables): MutationPromise<CreatePlanData, CreatePlanVariables>;

interface AssignMembershipRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignMembershipVariables): MutationRef<AssignMembershipData, AssignMembershipVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignMembershipVariables): MutationRef<AssignMembershipData, AssignMembershipVariables>;
  operationName: string;
}
export const assignMembershipRef: AssignMembershipRef;

export function assignMembership(vars: AssignMembershipVariables): MutationPromise<AssignMembershipData, AssignMembershipVariables>;
export function assignMembership(dc: DataConnect, vars: AssignMembershipVariables): MutationPromise<AssignMembershipData, AssignMembershipVariables>;

interface RecordPaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordPaymentVariables): MutationRef<RecordPaymentData, RecordPaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordPaymentVariables): MutationRef<RecordPaymentData, RecordPaymentVariables>;
  operationName: string;
}
export const recordPaymentRef: RecordPaymentRef;

export function recordPayment(vars: RecordPaymentVariables): MutationPromise<RecordPaymentData, RecordPaymentVariables>;
export function recordPayment(dc: DataConnect, vars: RecordPaymentVariables): MutationPromise<RecordPaymentData, RecordPaymentVariables>;

interface CreateCheckInRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCheckInVariables): MutationRef<CreateCheckInData, CreateCheckInVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCheckInVariables): MutationRef<CreateCheckInData, CreateCheckInVariables>;
  operationName: string;
}
export const createCheckInRef: CreateCheckInRef;

export function createCheckIn(vars: CreateCheckInVariables): MutationPromise<CreateCheckInData, CreateCheckInVariables>;
export function createCheckIn(dc: DataConnect, vars: CreateCheckInVariables): MutationPromise<CreateCheckInData, CreateCheckInVariables>;

