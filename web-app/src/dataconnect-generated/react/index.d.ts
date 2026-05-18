import { ListMembersData, ListPlansData, ListPaymentsData, ListCheckInsData, CreateMemberData, CreateMemberVariables, CreatePlanData, CreatePlanVariables, AssignMembershipData, AssignMembershipVariables, RecordPaymentData, RecordPaymentVariables, CreateCheckInData, CreateCheckInVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListMembers(options?: useDataConnectQueryOptions<ListMembersData>): UseDataConnectQueryResult<ListMembersData, undefined>;
export function useListMembers(dc: DataConnect, options?: useDataConnectQueryOptions<ListMembersData>): UseDataConnectQueryResult<ListMembersData, undefined>;

export function useListPlans(options?: useDataConnectQueryOptions<ListPlansData>): UseDataConnectQueryResult<ListPlansData, undefined>;
export function useListPlans(dc: DataConnect, options?: useDataConnectQueryOptions<ListPlansData>): UseDataConnectQueryResult<ListPlansData, undefined>;

export function useListPayments(options?: useDataConnectQueryOptions<ListPaymentsData>): UseDataConnectQueryResult<ListPaymentsData, undefined>;
export function useListPayments(dc: DataConnect, options?: useDataConnectQueryOptions<ListPaymentsData>): UseDataConnectQueryResult<ListPaymentsData, undefined>;

export function useListCheckIns(options?: useDataConnectQueryOptions<ListCheckInsData>): UseDataConnectQueryResult<ListCheckInsData, undefined>;
export function useListCheckIns(dc: DataConnect, options?: useDataConnectQueryOptions<ListCheckInsData>): UseDataConnectQueryResult<ListCheckInsData, undefined>;

export function useCreateMember(options?: useDataConnectMutationOptions<CreateMemberData, FirebaseError, CreateMemberVariables>): UseDataConnectMutationResult<CreateMemberData, CreateMemberVariables>;
export function useCreateMember(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMemberData, FirebaseError, CreateMemberVariables>): UseDataConnectMutationResult<CreateMemberData, CreateMemberVariables>;

export function useCreatePlan(options?: useDataConnectMutationOptions<CreatePlanData, FirebaseError, CreatePlanVariables>): UseDataConnectMutationResult<CreatePlanData, CreatePlanVariables>;
export function useCreatePlan(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePlanData, FirebaseError, CreatePlanVariables>): UseDataConnectMutationResult<CreatePlanData, CreatePlanVariables>;

export function useAssignMembership(options?: useDataConnectMutationOptions<AssignMembershipData, FirebaseError, AssignMembershipVariables>): UseDataConnectMutationResult<AssignMembershipData, AssignMembershipVariables>;
export function useAssignMembership(dc: DataConnect, options?: useDataConnectMutationOptions<AssignMembershipData, FirebaseError, AssignMembershipVariables>): UseDataConnectMutationResult<AssignMembershipData, AssignMembershipVariables>;

export function useRecordPayment(options?: useDataConnectMutationOptions<RecordPaymentData, FirebaseError, RecordPaymentVariables>): UseDataConnectMutationResult<RecordPaymentData, RecordPaymentVariables>;
export function useRecordPayment(dc: DataConnect, options?: useDataConnectMutationOptions<RecordPaymentData, FirebaseError, RecordPaymentVariables>): UseDataConnectMutationResult<RecordPaymentData, RecordPaymentVariables>;

export function useCreateCheckIn(options?: useDataConnectMutationOptions<CreateCheckInData, FirebaseError, CreateCheckInVariables>): UseDataConnectMutationResult<CreateCheckInData, CreateCheckInVariables>;
export function useCreateCheckIn(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCheckInData, FirebaseError, CreateCheckInVariables>): UseDataConnectMutationResult<CreateCheckInData, CreateCheckInVariables>;
