import { ChevronUpIcon } from '@heroicons/react/solid';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import AboutHeader from '../../components/AboutHeader';
import FaqDisclosure from '../../components/FaqDisclosure';
import { RequestHelper } from '../../lib/request-helper';

/**
 * The FAQ page.
 *
 * This page contains frequently asked questions for the hackathon.
 *
 * Route: /about/faq
 */
export default function FaqPage({ fetchedFaqs }: { fetchedFaqs: AnsweredQuestion[] }) {
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState<AnsweredQuestion[]>([]);
  const [disclosuresStatus, setDisclosureStatus] = useState<boolean[]>();

  useEffect(() => {
    setFaqs(fetchedFaqs);
    setDisclosureStatus(fetchedFaqs.map(() => false));
    setLoading(false);
  }, [fetchedFaqs]);

  /**
   *
   * Expand all FAQ disclosures
   *
   */
  const expandAll = () => {
    setDisclosureStatus(new Array(disclosuresStatus.length).fill(true));
  };

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-Celadonblue">
      <Head>
        <title>HackPortal - FAQ</title>
        <meta name="description" content="HackPortal's Frequently Asked Questions" />
      </Head>
      <AboutHeader active="/about/faq" />
      <div className="top-6 p-4">
        <div className="flex flex-row justify-between items-center border-b-2 border-black py-2 bg-Celadonblue">
          <h4 className="font-bold text-3xl">FAQ</h4>
          <div className="flex flex-row items-center gap-x-2">
            <button
              onClick={() => {
                expandAll();
              }}
              className="font-bold"
            >
              Expand All
            </button>
            <ChevronUpIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="top-6 p-4 flex flex-col gap-y-3 ">
          <div className="flex flex-col flex-grow bg-Celadonblue">
            <h5 className="font-bold  text-2xl">Where will the hackathon be held?</h5>
            <div className="flex flex-row items-left gap-x-2">
              <p>
                Over a 36 hour period, you will work in a team of 1-5 hackers to make anything your
                heart desires! We will be hosting the hackathon in person at ECSW, there will be a
                variety of workshops and socials to attend during the event.
              </p>
            </div>
          </div>
        </div>

        <div className="top-6 p-4 flex flex-col gap-y-3">
          <div className="flex flex-col flex-grow bg-Celadonblue">
            <h5 className="font-bold  text-2xl">Will there still be swag?</h5>
            <div className="flex flex-row items-left gap-x-2">
              <p> Swag will be given out at social events as prizes! </p>
            </div>
          </div>
        </div>

        <div className="top-6 p-4 flex flex-col gap-y-3">
          <div className="flex flex-col flex-grow bg-Celadonblue">
            <h5 className="font-bold  text-2xl">What if I have never hacked before?</h5>
            <div className="flex flex-row items-left gap-x-2">
              <p>
                That is totally okay! We will have plenty of resources to help you get started,
                including beginner workshops, mentors, and more.
              </p>
            </div>
          </div>
        </div>

        <div className="top-6 p-4 flex flex-col gap-y-3">
          <div className="flex flex-col flex-grow bg-Celadonblue">
            <h5 className="font-bold  text-2xl">Can I hack?</h5>
            <div className="flex flex-row items-left gap-x-2">
              <p>
                All UTD graduate and undergraduate students are welcome to participate as hackers.
                We encourage makers of all levels to come build and learn! We are extremely beginner
                friendly!
              </p>
            </div>
          </div>
        </div>

        <div className="top-6 p-4 flex flex-col gap-y-3">
          <div className="flex flex-col flex-grow bg-Celadonblue">
            <h5 className="font-bold  text-2xl">How much does it cost?</h5>
            <div className="flex flex-row items-left gap-x-2">
              <p>
                This event is completely free. We will provide a plethora of materials and tools for
                all hackers. Everything is on us!
              </p>
            </div>
          </div>
        </div>

        <div className="top-6 p-4 flex flex-col gap-y-3">
          <div className="flex flex-col flex-grow bg-Celadonblue">
            <h5 className="font-bold  text-2xl">How to contact us?</h5>
            <div className="flex flex-row items-left gap-x-2">
              <p>
                Feel free to email us with questions at {'comethack21@gmail.com'}
                <a
                  href="/cdn-cgi/l/email-protection"
                  className="__cf_email__"
                  data-cfemail="8eede1e3ebfae6efede5bcbfcee9e3efe7e2a0ede1e3"
                >
                  {/* [comethack21@gmail.com] */}
                </a>{' '}
                or connect through our social media.
                <div className="social-icons">
                  <a
                    href="https://www.facebook.com/CometHack"
                    className="fab fa-facebook-f fa-lg"
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                  <a
                    href="https://www.instagram.com/comet_hack/"
                    className="fab fa-instagram fa-lg"
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                  <a
                    href="https://www.linkedin.com/company/comet-hack/about/"
                    className="fab fa-linkedin-in fa-lg"
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                </div>
              </p>
            </div>
          </div>
        </div>

        <div className="w-full my-3 flex flex-col gap-y-4">
          {faqs.map(({ question, answer }, idx) => (
            <FaqDisclosure
              key={idx}
              question={question}
              answer={answer}
              isOpen={disclosuresStatus[idx]}
              toggleDisclosure={() => {
                const currDisclosure = [...disclosuresStatus];
                currDisclosure[idx] = !currDisclosure[idx];
                setDisclosureStatus(currDisclosure);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 *
 * Fetch FAQ questions stored in the backend, which will be used as props by FaqPage component upon build time
 *
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data } = await RequestHelper.get<AnsweredQuestion[]>(
    `${protocol}://${context.req.headers.host}/api/questions/faq`,
    {},
  );
  return {
    props: {
      fetchedFaqs: data,
    },
  };
};
