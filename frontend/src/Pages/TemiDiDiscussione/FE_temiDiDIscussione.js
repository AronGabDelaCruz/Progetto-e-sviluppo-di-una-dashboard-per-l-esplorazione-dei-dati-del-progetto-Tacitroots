import React, { useState } from "react";
import TableTopics from "./table_topicsList";
import LineTopicByYear from "./line_topicByYear";
import HorizontalBarTopicReceverSender from "./HorizontalBar_topicReceverSender";
import HorizontalBarInsExp from "./HorizontalBar_InstrumentExperiment";
import MapTopicLocation from "./map_topicLocation";
import HorizontalBarBook from "./HorizontalBar_topicBook";
function TemiPage() {
  const [selectedTopic, setSelectedTopic] = useState("print culture");

  return (
    <div className="people-page">
      <div className="header">
        <h1 className="title">Topics</h1>
      </div>

      <div className="grid-2">
        <TableTopics onView={setSelectedTopic} selectedTopic={selectedTopic}/>
        <LineTopicByYear selectedTopic={selectedTopic}/>
      </div>
      <div className="grid-2">
        <HorizontalBarTopicReceverSender selectedTopic={selectedTopic}/>
        <HorizontalBarInsExp selectedTopic={selectedTopic}/>
      </div>
      <div className="grid-2">
        <MapTopicLocation selectedTopic={selectedTopic}/>
        <HorizontalBarBook selectedTopic={selectedTopic}/>
      </div>
    </div>
  );
}

export default TemiPage;