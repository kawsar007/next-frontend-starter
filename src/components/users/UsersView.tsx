/**
 * UsersView — full CRUD interface for the users list.
 * Uses RTK Query for data + Zustand modal state.
 */
'use client';

import { useState, useCallback } from 'react';
import { Plus, Search, RefreshCw, Trash2, Pencil, Eye } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '@services/api/userApi';
import { useAppSelector } from '@store/hooks';
import { selectUserRole }  from '@store/slices/authSlice';
import { useUIStore }      from '@store/uiStore';
import { Button }          from '@/components/ui/Button';
import { Avatar }          from '@/components/ui/Avatar';
import { RoleBadge, StatusBadge } from '@/components/ui/Badge';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Pagination }      from '@/components/ui/Pagination';
import { UserTableSkeleton } from '@/components/skeletons';
import { UserModal }       from './UserModal';
import { formatDate }      from '@/lib/utils';
import toast               from 'react-hot-toast';
import type { User }       from '@/types';

export function UsersView() {
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState('');
  const role    = useAppSelector(selectUserRole);
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isSuper = role === 'SUPER_ADMIN';

  const { data, isLoading, isFetching, refetch } = useGetUsersQuery({ page, limit: 10 });
  const [deleteUser, { isLoading: isDeleting }]  = useDeleteUserMutation();
  const { openModal, modal, closeModal }          = useUIStore();

  const users = data?.data?.data ?? [];
  const meta  = data?.data?.meta;

  const filteredUsers = search
    ? users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const handleDelete = useCallback(async (user: User) => {
    if (!confirm(`Delete ${user.username}? This cannot be undone.`)) return;
    try {
      await deleteUser(user.id).unwrap();
      toast.success(`${user.username} deleted`);
    } catch {
      toast.error('Failed to delete user');
    }
  }, [deleteUser]);

  return (
    <>
      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 border-b border-border">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-border bg-input
                text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => refetch()} title="Refresh">
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            </Button>
            {isAdmin && (
              <Button size="sm" onClick={() => openModal('create-user')}>
                <Plus size={14} /> Add User
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <UserTableSkeleton />
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground text-sm">
            {search ? `No users matching "${search}"` : 'No users found'}
          </div>
        ) : (
          <Table>
            <Thead>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th className="hidden md:table-cell">Joined</Th>
              <Th className="hidden lg:table-cell">Last login</Th>
              <Th className="w-24 text-right">Actions</Th>
            </Thead>
            <Tbody>
              {filteredUsers.map((user, i) => (
                <Tr key={user.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` } as React.CSSProperties}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar user={user} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td><RoleBadge role={user.role} /></Td>
                  <Td><StatusBadge status={user.status} /></Td>
                  <Td className="hidden md:table-cell text-muted-foreground text-xs">{formatDate(user.createdAt)}</Td>
                  <Td className="hidden lg:table-cell text-muted-foreground text-xs">{formatDate(user.lastLoginAt)}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openModal('view-user', user)} title="View">
                        <Eye size={13} />
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => openModal('edit-user', user)} title="Edit">
                          <Pencil size={13} />
                        </Button>
                      )}
                      {isSuper && (
                        <Button variant="ghost" size="icon"
                          className="hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(user)} title="Delete">
                          <Trash2 size={13} />
                        </Button>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-4 pb-4">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal */}
      <UserModal
        isOpen={modal.type === 'create-user' || modal.type === 'edit-user' || modal.type === 'view-user'}
        onClose={closeModal}
        type={modal.type as 'create-user' | 'edit-user' | 'view-user' | null}
        user={modal.payload as User | null}
      />
    </>
  );
}
