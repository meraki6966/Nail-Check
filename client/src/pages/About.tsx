export default function About() {
  return (
    <>
      <div className="about-page">
        <div className="about-hero">
          <h1>About the Founder</h1>
        </div>

        <div className="about-content">
          <div className="about-section">
            <p>
              Always an artist at heart, my journey into the nail world began in Queens, NY.
            </p>
            <p>
              Growing up, I was mesmerized by my aunt's manicures, counting down the days until I
              turned thirteen and could finally get my own. By high school, I was hooked. I wasn't
              just looking for a simple polish; I was obsessed with the architecture of long acrylics
              and the limitless possibilities of 3D art. From hand-painted masterpieces to
              encapsulated dollar bills and tiny 3D bubblegum machines, I saw nails as a tiny,
              powerful canvas.
            </p>
            <p>
              However, finding representation wasn't always easy. Growing up, there weren't many nail
              artists who looked like me, so I admired the craft from a distance. As I moved around,
              the struggle of finding a new tech became a recurring challenge. I'd find myself
              constantly asking: Will they get the shaping right? Will the retention hold up? Can they
              actually execute the vision in my head?
            </p>
          </div>

          <div className="about-section">
            <h3>THE SPARK OF INSPIRATION</h3>
            <p>
              As the industry evolved into a diverse, global artistic space, my desire for creative
              expression grew. Social media opened a window to techniques from all over the world. I
              saw mind-blowing creativity on Pinterest and booked sets via Instagram, but I realized
              that being a "nail girly" with high standards wasn't enough—I wanted to be part of the
              creation.
            </p>
            <p>
              I dove headfirst into the "University of the Internet." I scoured YouTube tutorials,
              asked endless questions in TikTok comments, and saved thousands of pins. But I quickly
              hit a wall. Many of my questions went unanswered. Whether techs were too busy to respond
              or intentionally gatekeeping their secrets, I found myself doing deep dives alone to
              figure out the "devil in the details"—how to stop lifting, how to isolate chrome, and
              which acrylics actually performed.
            </p>
          </div>

          <div className="about-section">
            <h3>A ONE-STOP SHOP FOR THE NAIL COMMUNITY</h3>
            <p>
              I realized I wasn't the only one with these questions. While nail school teaches you how
              to pass the State Board, it doesn't always teach you how to master the art.
            </p>
            <p>
              That is why I created this platform. I wanted to build the resource I wish I had: a
              one-stop shop for nail enthusiasts. Whether you are looking for:
            </p>
            <ul>
              <li>Step-by-step tutorials and techniques</li>
              <li>Curated supply lists and product recommendations</li>
              <li>Global inspiration and design galleries</li>
              <li>A bridge to connect with and book talented techs</li>
            </ul>
            <p>
              This is a safe space to share, ask, learn, and create. This is for the artists, the
              dreamers, and every nail enthusiast looking to level up their craft.
            </p>
            <p className="about-closing">
              Welcome to the Nail Check community. Let's create something beautiful together.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .about-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .about-hero {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(135deg, #FFF5F8, #E8F4FF);
          border-radius: 20px;
          margin-bottom: 60px;
        }
        .about-hero h1 {
          font-family: var(--font-heading);
          font-weight: var(--heading-weight);
          font-size: 3rem;
          background: linear-gradient(90deg, #FF6B9D, #9B5DE5, #00D9FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }
        .about-content { line-height: 1.8; }
        .about-section { margin-bottom: 50px; }
        .about-section h3 {
          font-family: var(--font-heading);
          font-weight: var(--heading-weight);
          text-transform: uppercase;
          font-size: 2rem;
          background: linear-gradient(90deg, #FF6B9D, #9B5DE5, #00D9FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 40px 0 20px;
        }
        .about-section p {
          font-family: var(--font-body);
          font-size: 1.1rem;
          color: #444;
          margin-bottom: 20px;
        }
        .about-section ul {
          font-family: var(--font-body);
          font-size: 1.1rem;
          color: #444;
          list-style: none;
          padding-left: 0;
          margin-bottom: 20px;
        }
        .about-section ul li {
          padding-left: 30px;
          position: relative;
          margin-bottom: 10px;
        }
        .about-section ul li:before {
          content: "•";
          color: #FF6B9D;
          font-weight: bold;
          font-size: 1.5rem;
          position: absolute;
          left: 0;
          line-height: 1.4;
        }
        .about-closing {
          font-size: 1.2rem !important;
          font-weight: 600;
          color: #9B5DE5 !important;
          margin-top: 30px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .about-hero h1 { font-size: 2rem; }
          .about-section h3 { font-size: 2rem; }
        }
      `}</style>
    </>
  );
}
