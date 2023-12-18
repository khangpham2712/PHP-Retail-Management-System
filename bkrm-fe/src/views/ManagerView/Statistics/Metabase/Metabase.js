import React, { useState } from "react";
import sign from "jwt-encode";

import { useSelector } from "react-redux";
import moment from "moment";

const METABASE_SITE_URL = "https://bkrm.metabaseapp.com";
const METABASE_SECRET_KEY =
  "177c5d748915f7d45d46a36a51fd7a43ac8a91e4ea48c05c77a5e711d4b17d60";

const payload = {
  resource: { dashboard: 3 },
  params: {},
  exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
};

const Metabase = () => {
  const token = sign(payload, METABASE_SECRET_KEY);

  const iframeUrl =
    METABASE_SITE_URL +
    "/embed/dashboard/" +
    token +
    "#bordered=false&titled=true";

  console.log(iframeUrl);
  // must be in format
  const today = new Date();
  const [dayQuery, setDayQuery] = useState({
    fromDate: moment(new Date(today.getFullYear(), today.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    toDate: moment(
      new Date(today.getFullYear(), today.getMonth() + 1, 0)
    ).format("YYYY-MM-DD"),
  });
  // const [selectedBranches, setSelectedBranches] = useState(branches?branches:[]);
  const [selectedBranches, setSelectedBranches] = useState("all");
  // unit used for chart data split by day/ month/ year
  const [unit, setUnit] = useState("day");

  return (
    <>
      <h1>Dashboard</h1>
      <iframe
        title="Dashboard"
        src={iframeUrl}
        width="100%"
        height="1000"
        // allowTransparency
      ></iframe>
    </>
  );
};

export default Metabase;
