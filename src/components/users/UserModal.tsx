'use client';

import { useEffect } from 'react';
import { useForm }   from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }         from 'zod';
import { Loader2 }   from 'lucide-react';
import toast         from 'react-hot-toast';
import { Modal }     from '@/components/ui/Modal';
import { Input }     from '@/components/ui/Input';
import { Label }     from '@/components/ui/Label';
import { Button }    from '@/components/ui/Button';
import { Avatar }    from '@/components/ui/Avatar';
import { RoleBadge, StatusBadge } from '@/components/ui/Badge';
import { formatDate, extractErrorMessage } from '@/lib/utils';
import { useCreateUserMutation, useUpdateUserMutation } from '@services/api/userApi';
import type { User, Role, UserStatus } from '@/types';

// ── Schemas ───────────────────────────────────────────────────
const createSchema = z.object({
  email:    z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  firstName: z.string().max(100).optional(),
  lastName:  z.string().max(100).optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).default('USER'),
});

const editSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName:  z.string().max(100).optional(),
  role:   z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED']),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues   = z.infer<typeof editSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'create-user' | 'edit-user' | 'view-user' | null;
  user: User | null;
}

export function UserModal({ isOpen, onClose, type, user }: UserModalProps) {
  const isView   = type === 'view-user';
  const isEdit   = type === 'edit-user';
  const isCreate = type === 'create-user';

  const title = isCreate ? 'Add User' : isEdit ? 'Edit User' : 'User Details';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={isView ? 'md' : 'md'}>
      {isCreate && <CreateUserForm onClose={onClose} />}
      {isEdit   && user && <EditUserForm   user={user} onClose={onClose} />}
      {isView   && user && <ViewUserForm   user={user} />}
    </Modal>
  );
}

// ── Create form ───────────────────────────────────────────────
function CreateUserForm({ onClose }: { onClose: () => void }) {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: 'USER' },
  });

  const onSubmit = async (values: CreateValues) => {
    try {
      await createUser(values).unwrap();
      toast.success('User created successfully');
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label htmlFor="c-fn">First name</Label>
          <Input id="c-fn" placeholder="Jane" {...register('firstName')} error={errors.firstName?.message} /></div>
        <div><Label htmlFor="c-ln">Last name</Label>
          <Input id="c-ln" placeholder="Doe" {...register('lastName')} error={errors.lastName?.message} /></div>
      </div>
      <div><Label htmlFor="c-email">Email *</Label>
        <Input id="c-email" type="email" placeholder="jane@company.com" {...register('email')} error={errors.email?.message} /></div>
      <div><Label htmlFor="c-user">Username *</Label>
        <Input id="c-user" placeholder="jane_doe" {...register('username')} error={errors.username?.message} /></div>
      <div><Label htmlFor="c-pass">Password *</Label>
        <Input id="c-pass" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} /></div>
      <div>
        <Label htmlFor="c-role">Role</Label>
        <select id="c-role" {...register('role')}
          className="mt-1.5 w-full h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background">
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Create User'}
        </Button>
      </div>
    </form>
  );
}

// ── Edit form ─────────────────────────────────────────────────
function EditUserForm({ user, onClose }: { user: User; onClose: () => void }) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    reset({ firstName: user.firstName, lastName: user.lastName, role: user.role, status: user.status });
  }, [user, reset]);

  const onSubmit = async (values: EditValues) => {
    try {
      await updateUser({ id: user.id, body: values }).unwrap();
      toast.success('User updated');
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-3 pb-2">
        <Avatar user={user} size="md" />
        <div><p className="font-medium text-foreground">{user.username}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>First name</Label><Input placeholder="Jane" {...register('firstName')} error={errors.firstName?.message} /></div>
        <div><Label>Last name</Label><Input placeholder="Doe"  {...register('lastName')}  error={errors.lastName?.message} /></div>
      </div>
      <div>
        <Label>Role</Label>
        <select {...register('role')}
          className="mt-1.5 w-full h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground
            focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>
      <div>
        <Label>Status</Label>
        <select {...register('status')}
          className="mt-1.5 w-full h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground
            focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

// ── View panel ────────────────────────────────────────────────
function ViewUserForm({ user }: { user: User }) {
  const rows: [string, React.ReactNode][] = [
    ['Email',       user.email],
    ['Username',    user.username],
    ['First name',  user.firstName ?? '—'],
    ['Last name',   user.lastName  ?? '—'],
    ['Role',        <RoleBadge key="r" role={user.role} />],
    ['Status',      <StatusBadge key="s" status={user.status} />],
    ['Joined',      formatDate(user.createdAt)],
    ['Last login',  formatDate(user.lastLoginAt)],
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Avatar user={user} size="lg" />
        <div>
          <p className="font-display text-lg text-foreground">
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
          </p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
