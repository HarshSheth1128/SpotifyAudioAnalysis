import { PageHeader, Typography, Card } from 'antd';
import React from 'react';
import SideBar from '../components/Sidebar';
import './InfoPage.css';

function InfoPage() {
  return (
    <div className="infoPageRoot">
        <div className="cardContainer">
          <Card className="card" title="What is this?" bordered={true} style={{width: '100%'}}>
            <Typography.Paragraph>
              This tool allows a user to analyze their playlist objectively.
              By analyzing different things such as the: valence, danceability, energy of a track
              We are able to create the ultimate playlist.
              Trying to create a study playlist? Well you probably don't want extremely high energy songs.
              Trying to create a banger playlist for your next event? You probably want your songs to have a low danceability.
              Use this tool to help you craft the ultimate playlist
            </Typography.Paragraph>
          </Card>
          <Card className="card" title="What are my analysis tools?" bordered={true} style={{width: '100%'}}>
            <Typography.Paragraph>
              As of now we offer two tools. You can sort and organize your data into a bar graph,
              where you can find the outliers and address them appropriately. However, this playlist data on its own 
              is not extremely useful. We make is more useful by offering another scatter chart tool.
              Here you can add up to 5 playlists, and see how all of them stack up against one another. 
              Then you can compare with your favourite playlists and see how your playlist stacks up against them.
            </Typography.Paragraph>
          </Card>
          <Card className="card subCardContainer" title="What do all these features mean?" bordered={true} style={{width: '100%'}}>
            <Card className="subCard" title="Danceability" bordered={true} style={{width: '100%'}}>
              <Typography.Paragraph>
              Danceability describes how suitable a track is for dancing based on a combination of 
              musical elements including tempo, rhythm stability, beat strength, and overall regularity. 
              A value of 0.0 is least danceable and 1.0 is most danceable.
              </Typography.Paragraph>
            </Card>
            <Card className="subCard" title="Energy" bordered={true} style={{width: '100%'}}>
              <Typography.Paragraph>
              Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. 
              Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, 
              while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute 
              include dynamic range, perceived loudness, timbre, onset rate, and general entropy. 
              </Typography.Paragraph>
            </Card>
            <Card className="subCard" title="Valence" bordered={true} style={{width: '100%'}}>
              <Typography.Paragraph>
              A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. 
              Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), 
              while tracks with low valence sound more negative (e.g. sad, depressed, angry).
              </Typography.Paragraph>
            </Card>
            <Card className="subCard" title="Tempo" bordered={true} style={{width: '100%'}}>
              <Typography.Paragraph>
              The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, 
              tempo is the speed or pace of a given piece and derives directly from the average beat duration. 
              </Typography.Paragraph>
            </Card>
          </Card>
        </div>
    </div>
  )

}

export default InfoPage;
