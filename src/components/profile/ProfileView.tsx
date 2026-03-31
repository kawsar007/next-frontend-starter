'use client';

import { useEffect } from 'react';
import { useForm }   from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }         from 'zod';
import { Loader2 }   from 'lucide-react';
import toast         from 'react-hot-toast';
import { useGetMeQuery, useUpdateUserMutation } from '@services/api/userApi';
import { useAppSelector } from '@store/hooks';
import { selectCurrentUser } from '@store/slices/authSlice';
import { Avatar }    from '@/components/ui/Avatar';
import { Input }     from '@/components/ui/Input';
import { Label }     from '@/components/ui/Label';
import { Button }    from '@/components/ui/Button';
import { RoleBadge, StatusBadge } from '@/components/ui/Badge';
import { formatDate, extractErrorMessage } from '@/lib/utils';
import { ProfileSkeleton } from '@/components/skeletons';

const profileSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName:  z.string().max(100).optional(),
});
type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileView() {
  const authUser = useAppSelector(selectCurrentUser);
  const { data, isLoading } = useGetMeQuery();
  const user = data?.data;

  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) reset({ firstName: user.firstName, lastName: user.lastName });
  }, [user, reset]);

  const onSubmit = async (values: ProfileValues) => {
    if (!authUser) return;
    try {
      await updateUser({ id: authUser.id, body: values }).unwrap();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (isLoading) return <div className="card p-6"><ProfileSkeleton /></div>;
  if (!user)     return <div className="card p-6 text-center text-muted-foreground">Could not load profile.</div>;

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="card p-6 flex items-center gap-5">
        <Avatar user={user} size="lg" className="w-16 h-16 text-lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl text-foreground">
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
          </h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <RoleBadge role={user.role} />
            <StatusBadge status={user.status} />
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-muted-foreground">Member since</p>
          <p className="text-sm text-foreground font-medium mt-0.5">{formatDate(user.createdAt)}</p>
          <p className="text-xs text-muted-foreground mt-2">Last login</p>
          <p className="text-sm text-foreground font-medium mt-0.5">{formatDate(user.lastLoginAt)}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="card p-6">
        <h4 className="font-semibold text-foreground mb-5">Personal Information</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="p-fn">First name</Label>
              <Input id="p-fn" placeholder="Jane" {...register('firstName')} error={errors.firstName?.message} />
            </div>
            <div>
              <Label htmlFor="p-ln">Last name</Label>
              <Input id="p-ln" placeholder="Doe" {...register('lastName')} error={errors.lastName?.message} />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled className="opacity-60 cursor-not-allowed" onChange={() => {}} />
            <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>

          <div>
            <Label>Username</Label>
            <Input value={user.username} disabled className="opacity-60 cursor-not-allowed" onChange={() => {}} />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSaving || !isDirty} size="md">
              {isSaving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Account info */}
      <div className="card p-6">
        <h4 className="font-semibold text-foreground mb-4">Account Details</h4>
        <div className="space-y-3">
          {([
            ['User ID',   `#${user.id}`],
            ['Role',      <RoleBadge key="r" role={user.role} />],
            ['Status',    <StatusBadge key="s" status={user.status} />],
            ['Created',   formatDate(user.createdAt)],
            ['Updated',   formatDate(user.updatedAt)],
          ] as [string, React.ReactNode][]).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-sm text-foreground font-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
