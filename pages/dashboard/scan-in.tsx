import Head from 'next/head';
import React from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import { useUser } from '../../lib/profile/user-data';
import { useAuthContext } from '../../lib/user/AuthContext';

/**
 * The dashboard / submit.
 *
 * Landing: /submit
 */
export default function Scan() {
  const { isSignedIn } = useAuthContext();
  const user = useUser();
  const role = user.permissions?.length > 0 ? user.permissions[0] : '';

  return (
    <div className="flex flex-wrap flex-grow">
      <Head>
        <title>HackerPacks</title>
        <meta name="description" content="HackPortal's Scan-In" />
      </Head>

      {/* ghost section to fill in for fixed sidebar */}
      <section
        id="ghost"
        className="flex justify-center h-screen sticky top-0 lg:w-1/8 md:w-1/7 w-1/6"
      ></section>

      <section
        id="Sidebar"
        className="flex justify-center items-center h-screen fixed top-16 border-r-2 border-gray-600 lg:w-1/8 md:w-1/7 w-1/6 text-xs lg:text-sm text-center"
      >
        <div>Welcome, {!user || !isSignedIn ? 'hacker' : user.firstName}</div>
        <div className="text-indigo-500">{role}</div>
      </section>

      <section id="mainContent" className="px-6 py-3 w-5/6 lg:wd-7/8 md:w-6/7">
        <section id="subheader" className="w-full pb-6 sticky top-16">
          <DashboardHeader />
        </section>
        <div className="font-bold text-2xl md:text-4xl lg-text-6xl">Big Heading</div>
      </section>
    </div>
  );
}
