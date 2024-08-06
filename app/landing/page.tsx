import React from "react";
import MediaQuery from "react-responsive";
import { getCategorizedPosts } from "../../lib/posts";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      files: getCategorizedPosts()
    }
  }
}

export default function Page() {
  /**
   * The media view for desktop users.
   * @returns The desktop media view used within a MediaQuery component.
   */
  const DesktopView = () => (
    <div className="flex justify-center flex-row flex-wrap">
      <div className="flex flex-col w-1/2 mt-10 mx-10 lg:text-xl md:text-md sm:text-md">
        
      </div>
    </div>
  );

  return (
    <div>
      <MediaQuery minWidth={768}>
        <DesktopView></DesktopView>
      </MediaQuery>
    </div>
  );
}
