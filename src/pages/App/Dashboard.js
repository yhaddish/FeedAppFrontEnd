import React, { useEffect, useContext, useState } from "react";

import { AppContext } from "../../context/applicationContext";
import LoadingIndicator from "../../components/LoadingIndicator";

import { getOthersFeedsApi } from "../../util/ApiUtil";

const Dashboard = () => {
  const appContext = useContext(AppContext);
  const token = appContext.getSession();
  const userData = appContext.getUserData();

  const [feedsData, setFeedsData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getOthersFeeds = async (loadPageNumber) => {
    if (loadPageNumber === 0) {
      setFeedsData([]);
    }

    const apiResponse = await getOthersFeedsApi(token, loadPageNumber);

    console.log(apiResponse);

    if (apiResponse.status === 1) {
      let feedsDataNew = [];
      if (loadPageNumber !== 0) {
        feedsDataNew = feedsData;
      }
      feedsDataNew.push(...apiResponse.payLoad.content);
      setFeedsData(feedsDataNew);

      setPageNumber(loadPageNumber + 1);

      if (loadPageNumber + 1 === apiResponse.payLoad.totalPages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  };

  useEffect(() => {
    document.title = "Home | Feed App";
    getOthersFeeds(0);
  }, []);

  if (!userData) {
    return <LoadingIndicator />;
  }

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-12 mx-0 md:mx-12 w-2xl container px-2 mx-auto">
      {/* {#MyProfile Component} */}
      <article>
        {/* {#AddFeed Component} */}
        {/* {#FeedCard Component} */}
      </article>
    </main>
  );
};

export default Dashboard;
