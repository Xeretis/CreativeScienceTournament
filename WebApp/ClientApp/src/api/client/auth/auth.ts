/**
 * Generated by orval v6.11.1 🍺
 * Do not edit manually.
 * WebApp
 * OpenAPI spec version: v1
 */
import {
  useQuery,
  useMutation
} from '@tanstack/react-query'
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey
} from '@tanstack/react-query'
import type {
  LoginResponse,
  ProblemDetails,
  LoginRequest,
  PostApiAuthConfirmEmailParams,
  PostApiAuthResendEmailConfirmationParams,
  UserResponse
} from '.././model'
import { useCustomClient } from '.././customClient';
import type { ErrorType, BodyType } from '.././customClient';


export const usePostApiAuthLoginHook = () => {
        const postApiAuthLogin = useCustomClient<LoginResponse>();

        return (
    loginRequest: BodyType<LoginRequest>,
 ) => {
        return postApiAuthLogin(
          {url: `/Api/Auth/Login`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: loginRequest
    },
          );
        }
      }
    


    export type PostApiAuthLoginMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePostApiAuthLoginHook>>>>
    export type PostApiAuthLoginMutationBody = BodyType<LoginRequest>
    export type PostApiAuthLoginMutationError = ErrorType<ProblemDetails>

    export const usePostApiAuthLogin = <TError = ErrorType<ProblemDetails>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostApiAuthLoginHook>>>, TError,{data: BodyType<LoginRequest>}, TContext>, }
) => {
      const {mutation: mutationOptions} = options ?? {};

      const postApiAuthLogin =  usePostApiAuthLoginHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePostApiAuthLoginHook>>>, {data: BodyType<LoginRequest>}> = (props) => {
          const {data} = props ?? {};

          return  postApiAuthLogin(data,)
        }

        

      return useMutation<Awaited<ReturnType<typeof postApiAuthLogin>>, TError, {data: BodyType<LoginRequest>}, TContext>(mutationFn, mutationOptions);
    }
    export const usePostApiAuthConfirmEmailHook = () => {
        const postApiAuthConfirmEmail = useCustomClient<void>();

        return (
    params?: PostApiAuthConfirmEmailParams,
 ) => {
        return postApiAuthConfirmEmail(
          {url: `/Api/Auth/ConfirmEmail`, method: 'post',
        params
    },
          );
        }
      }
    


    export type PostApiAuthConfirmEmailMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePostApiAuthConfirmEmailHook>>>>
    
    export type PostApiAuthConfirmEmailMutationError = ErrorType<ProblemDetails>

    export const usePostApiAuthConfirmEmail = <TError = ErrorType<ProblemDetails>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostApiAuthConfirmEmailHook>>>, TError,{params?: PostApiAuthConfirmEmailParams}, TContext>, }
) => {
      const {mutation: mutationOptions} = options ?? {};

      const postApiAuthConfirmEmail =  usePostApiAuthConfirmEmailHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePostApiAuthConfirmEmailHook>>>, {params?: PostApiAuthConfirmEmailParams}> = (props) => {
          const {params} = props ?? {};

          return  postApiAuthConfirmEmail(params,)
        }

        

      return useMutation<Awaited<ReturnType<typeof postApiAuthConfirmEmail>>, TError, {params?: PostApiAuthConfirmEmailParams}, TContext>(mutationFn, mutationOptions);
    }
    export const usePostApiAuthResendEmailConfirmationHook = () => {
        const postApiAuthResendEmailConfirmation = useCustomClient<void>();

        return (
    params?: PostApiAuthResendEmailConfirmationParams,
 ) => {
        return postApiAuthResendEmailConfirmation(
          {url: `/Api/Auth/ResendEmailConfirmation`, method: 'post',
        params
    },
          );
        }
      }
    


    export type PostApiAuthResendEmailConfirmationMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePostApiAuthResendEmailConfirmationHook>>>>
    
    export type PostApiAuthResendEmailConfirmationMutationError = ErrorType<unknown>

    export const usePostApiAuthResendEmailConfirmation = <TError = ErrorType<unknown>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostApiAuthResendEmailConfirmationHook>>>, TError,{params?: PostApiAuthResendEmailConfirmationParams}, TContext>, }
) => {
      const {mutation: mutationOptions} = options ?? {};

      const postApiAuthResendEmailConfirmation =  usePostApiAuthResendEmailConfirmationHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePostApiAuthResendEmailConfirmationHook>>>, {params?: PostApiAuthResendEmailConfirmationParams}> = (props) => {
          const {params} = props ?? {};

          return  postApiAuthResendEmailConfirmation(params,)
        }

        

      return useMutation<Awaited<ReturnType<typeof postApiAuthResendEmailConfirmation>>, TError, {params?: PostApiAuthResendEmailConfirmationParams}, TContext>(mutationFn, mutationOptions);
    }
    export const useGetApiAuthUserHook = () => {
        const getApiAuthUser = useCustomClient<UserResponse>();

        return (
    
 signal?: AbortSignal
) => {
        return getApiAuthUser(
          {url: `/Api/Auth/User`, method: 'get', signal
    },
          );
        }
      }
    

export const getGetApiAuthUserQueryKey = () => [`/Api/Auth/User`];

    
export type GetApiAuthUserQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetApiAuthUserHook>>>>
export type GetApiAuthUserQueryError = ErrorType<unknown>

export const useGetApiAuthUser = <TData = Awaited<ReturnType<ReturnType<typeof useGetApiAuthUserHook>>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetApiAuthUserHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiAuthUserQueryKey();

  const getApiAuthUser =  useGetApiAuthUserHook();


  const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetApiAuthUserHook>>>> = ({ signal }) => getApiAuthUser(signal);


  

  const query = useQuery<Awaited<ReturnType<ReturnType<typeof useGetApiAuthUserHook>>>, TError, TData>(queryKey, queryFn, queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
}

export const useDeleteApiAuthLogoutHook = () => {
        const deleteApiAuthLogout = useCustomClient<void>();

        return (
    
 ) => {
        return deleteApiAuthLogout(
          {url: `/Api/Auth/Logout`, method: 'delete'
    },
          );
        }
      }
    


    export type DeleteApiAuthLogoutMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useDeleteApiAuthLogoutHook>>>>
    
    export type DeleteApiAuthLogoutMutationError = ErrorType<unknown>

    export const useDeleteApiAuthLogout = <TError = ErrorType<unknown>,
    TVariables = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteApiAuthLogoutHook>>>, TError,TVariables, TContext>, }
) => {
      const {mutation: mutationOptions} = options ?? {};

      const deleteApiAuthLogout =  useDeleteApiAuthLogoutHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useDeleteApiAuthLogoutHook>>>, TVariables> = () => {
          

          return  deleteApiAuthLogout()
        }

        

      return useMutation<Awaited<ReturnType<typeof deleteApiAuthLogout>>, TError, TVariables, TContext>(mutationFn, mutationOptions);
    }
    