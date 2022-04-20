import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import AboutHeader from '../../components/AboutHeader';
import MemberCard from '../../components/MemberCard';
import MemberCards from '../../components/MemberCards';
import { RequestHelper } from '../../lib/request-helper';

/**
 * The About page.
 *
 * This page contains some introduction about the hackathon in question. It also includes a section used
 * to introduce the team responsible for organizing the hackathon
 *
 * Route: /about
 */
export default function AboutPage({ fetchedMembers }: { fetchedMembers: TeamMember[] }) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    setMembers(fetchedMembers.sort((a, b) => (a.rank > b.rank ? 1 : -1)));
    setLoading(false);
  }, [fetchedMembers]);

  const colorSchemes: ColorScheme[] = [
    {
      light: '#F2F3FF',
      dark: '#C1C8FF',
    },
    {
      light: '#D8F8FF',
      dark: '#B0F1FF',
    },
    {
      dark: '#FCD7FF',
      light: '#FDECFF',
    },
  ];

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-blue">
      <Head>
        <title>HackPortal - About</title>
        <meta name="description" content="HackPortal's About Page" />
      </Head>
      <AboutHeader active="/about" />
      <div className="top-6 p-4 flex flex-col gap-y-3">
        <h4 className="font-bold text-3xl">Our Mission Statement</h4>
        <p>
          As Future engineers, wer are expected to set the pace of tecknological advancements. Yet,
          we are often lost in space looking for starting point. Comet Hack is dedicated to
          providing the resources and opportunities to fuel our innovative spirits and creative
          ideas through the virtual environment.
        </p>
      </div>
      <div className="top-6 p-4 flex flex-col gap-y-3">
        <div className="flex flex-col flex-grow bg-white">
          <h5>What is Comet Hack?</h5>
          <div className="flex flex-row items-left gap-x-2">
            <p>
              Simply put, hackathons combine the two words: hacking and marathon. Participants will
              form teams of 1-3 members and bring a project idea to life in 36 hours! Students will
              receive mentorship, learn about new job opportunities, and compete for some cool
              prizes!
            </p>
          </div>
        </div>
      </div>

      <div className="top-6 p-4 flex flex-col gap-y-3">
        <div className="flex flex-col flex-grow bg-white">
          <h3>Why Should You Attend?</h3>
          <div className="flex flex-row items-center gap-x-2">
            <p>
              There are too many reasons! Create bonds and have unforgettable memories with friends
              from all over the country or even the world. Meet with large companies and inspiring
              startups that are looking for talented students like you. Attend fun-packed
              festivities to make friends and de-stress. Learn how to transfer your skills to
              industry or academia. Work on amazing hacks with help from your peers and mentors. And
              of course, compete to win $4000 in prizes ranging from airpods to Nintendo Switches!
            </p>
          </div>
        </div>
      </div>

      <div className="top-6 p-4 flex flex-col gap-y-3">
        <div className="flex flex-col flex-grow bg-white">
          <h3>Will there be reimbursement for hardware?</h3>
          <p>
            Yes, each team will have a limited amount of funds to spend on their hardware. This
            amount will be released closer to the event date.
          </p>
        </div>
      </div>

      <div className="top-6 p-4 flex flex-col gap-y-3">
        <div className="flex flex-col flex-grow bg-white">
          <h3>How to join our hacking community?</h3>
          <p>
            Join our discord! We will make announcements and can answer any questions there. Make
            sure to also join our social media to make sure you don’t miss any announcements.
          </p>
        </div>
      </div>

      <div className="my-2">
        <h4 className="font-bold text-3xl p-6">Meet Our Team :)</h4>
        <div className="flex flex-wrap justify-center md:px-2">
          {members.map(({ name, description, linkedin, github, personalSite, fileName }, idx) => (
            <MemberCards
              key={idx}
              name={name}
              description={description}
              fileName={fileName}
              linkedin={linkedin}
              github={github}
              personalSite={personalSite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data } = await RequestHelper.get<TeamMember[]>(
    `${protocol}://${context.req.headers.host}/api/members`,
    {},
  );
  return {
    props: {
      fetchedMembers: data,
    },
  };
};
