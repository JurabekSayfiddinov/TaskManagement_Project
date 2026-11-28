'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import getme from './prof';



export default function ProfilePage() {
    const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: getme,
  });

  return (
    <section aria-labelledby="profile-title" className="space-y-6 text-slate-950">
      <header>
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="text-slate-600 hover:text-indigo-700 hover:underline"
          >
            Dashboard
          </Link>
          <span aria-hidden="true" className="text-slate-400">/</span>
          <span aria-current="page">Profile</span>
        </nav>

        <h1 id="profile-title" className="text-3xl font-bold">
          Profile
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your account details.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div
          aria-hidden="true"
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-indigo-50 text-2xl font-semibold text-indigo-700"
        >{data?.display_name?.trim().charAt(0).toUpperCase() || '?'}
        </div>

        <div className="min-w-0 flex-1">
          <p className="mt-1 break-words text-sm text-slate-600">
            {data?.email}
          </p>
        </div>

        <Link
          href="/profile/editme"
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Edit profile
        </Link>
      </div>

      <div className="max-w-2xl">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-200 bg-slate-50 px-5 py-4 font-semibold">
            Account details
          </h2>

          <dl className="divide-y divide-slate-200">
            <div className="grid gap-1 px-5 py-4 sm:grid-cols-2 sm:gap-4">
              <dt className="text-sm text-slate-600">Display name</dt>
              <dd className="break-words text-sm font-medium">{data?.display_name}</dd>
            </div>

            <div className="grid gap-1 px-5 py-4 sm:grid-cols-2 sm:gap-4">
              <dt className="text-sm text-slate-600">Username</dt>
              <dd className="break-words text-sm font-medium">@{data?.email}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
}
