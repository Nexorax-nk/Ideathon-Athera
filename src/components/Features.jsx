import { BarChart3, Code2, Crosshair, Target } from 'lucide-react';
import './Features.css';

const features = [
  { title: 'IDENTIFY',      description: 'Identify real-world\nproblems worth solving.',    Icon: Target    },
  { title: 'INNOVATE',      description: 'Design intelligent\nsolutions with AI.',           Icon: Code2     },
  { title: 'PRESENT',       description: 'Present your idea with\nclarity and impact.',      Icon: BarChart3 },
  { title: 'CREATE IMPACT', description: 'Build a better future\nthrough innovation.',       Icon: Crosshair },
];

const Features = () => (
  <section className="features" aria-label="Ideathon journey" data-parallax="0.09">
    {features.map(({ title, description, Icon }, index) => (
      <article className="feature" key={title} style={{ '--delay': `${index * 90}ms` }}>
        <div className="feature-emblem" aria-hidden="true">
          <span />
          <Icon size={30} strokeWidth={1.25} />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </article>
    ))}
  </section>
);

export default Features;
