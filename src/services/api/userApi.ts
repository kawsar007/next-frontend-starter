/**
 * userApi — RTK Query endpoints for User CRUD.
 * All endpoints require authentication (handled by customBaseQuery).
 *
 * Tag-based cache invalidation ensures the list refreshes
 * automatically after create / update / delete operations.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';
import type {
  ApiResponse,
  PaginatedData,
  PaginationQuery,
  User,
  CreateUserPayload,
  UpdateUserPayload,
} from '@/types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customBaseQuery,
  tagTypes: ['User', 'UserList'],
  endpoints: (builder) => ({

    /** GET /users?page=1&limit=10 */
    getUsers: builder.query<ApiResponse<PaginatedData<User>>, PaginationQuery>({
      query: ({ page = 1, limit = 10 } = {}) => `/users?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'UserList', id: 'LIST' },
            ]
          : [{ type: 'UserList', id: 'LIST' }],
    }),

    /** GET /users/me */
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => '/users/me',
      providesTags: [{ type: 'User', id: 'ME' }],
    }),

    /** GET /users/:id */
    getUserById: builder.query<ApiResponse<User>, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_, __, id) => [{ type: 'User', id }],
    }),

    /** POST /users */
    createUser: builder.mutation<ApiResponse<User>, CreateUserPayload>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: [{ type: 'UserList', id: 'LIST' }],
    }),

    /** PATCH /users/:id */
    updateUser: builder.mutation<ApiResponse<User>, { id: number; body: UpdateUserPayload }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'User', id },
        { type: 'UserList', id: 'LIST' },
        { type: 'User', id: 'ME' },
      ],
    }),

    /** DELETE /users/:id */
    deleteUser: builder.mutation<ApiResponse<User>, number>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: (_, __, id) => [
        { type: 'User', id },
        { type: 'UserList', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetMeQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
