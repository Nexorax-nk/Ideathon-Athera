import { Clock3, MapPin, Timer, Users, Lightbulb } from 'lucide-react';
import './EventDetails.css';

const facts = [
  { eyebrow: 'STARTING TIME', value: '10:00 AM', Icon: Clock3 },
  { eyebrow: 'BATCH 1 ', value: '10:00 AM - 11:45 AM', Icon: Timer },
  { eyebrow: 'BATCH 2 ', value: '12:00 PM - 1:45 PM', Icon: Timer },
  { eyebrow: 'VENUE', value: 'Networking Lab ', Icon: MapPin },
  { eyebrow:'TEAM SIZE', value: '1 - 2 members per team',Icon: Users },
  { eyebrow:'THEME', value: 'Problem-solving competition',Icon: Lightbulb }
];

const EventOverview = () => (
  <section className="event-overview" id="event-details" aria-labelledby="event-title" data-parallax="0.08">
    <div className="event-heading">
      <span />
      <h2 id="event-title">EVENT DETAILS</h2>
      <span />
    </div>

    <div className="event-facts">
      {facts.map(({ eyebrow, value, Icon }, index) => (
        <article key={eyebrow}>
          <div className="event-icon" aria-hidden="true"><Icon /></div>
          <div className="event-copy">
            <span>{eyebrow}</span>
            <strong>{value}</strong>
          </div>
          <small aria-hidden="true">0{index + 1}</small>
        </article>
      ))}
    </div>
  </section>
);

export default EventOverview;
