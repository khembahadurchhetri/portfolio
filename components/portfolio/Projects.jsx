import Image from "next/image";
export default function Projects() {
  return (
    <>
      <section id={"projects"}>
        <div className={"section-wrap"}>
          <div className={"section-header reveal"}>
            <div>
              <div className={"section-kicker"}>{"My work"}</div>

              <h2 className={"section-title"}>
                {"Featured"}
                <br />
                <span>{"projects"}</span>
              </h2>
            </div>

            <p className={"scroll-hint"}>{"← swipe / scroll →"}</p>
          </div>

          <div className={"projects-scroll reveal"}>
            <div className={"project-card"}>
              <span className={"project-badge saas"}>{"AI · SaaS"}</span>

              <Image
                sizes="(max-width: 768px) 270px, 340px"
                className={
                  "project-preview project-preview--screen project-preview--chat"
                }
                src={"/assets/hamrochatbot.png"}
                alt={"HamroChatbot dashboard with its embedded chat assistant"}
                loading={"lazy"}
                width={"1363"}
                height={"626"}
              />

              <div className={"project-title"}>{"HamroChatbot"}</div>

              <p className={"project-desc"}>
                {
                  " Next.js chatbot platform with an embeddable widget, knowledge-base upload, and payment integration for selling chatbot access. "
                }
              </p>

              <div className={"project-stack"}>
                <span>{"Next.js"}</span>
                <span>{"Stripe"}</span>
                <span>{"Widget SDK"}</span>
              </div>

              <div className={"project-links"}>
                <a
                  className={"live"}
                  href={"https://hamrobot.vercel.app"}
                  target={"_blank"}
                  rel={"noopener"}
                >
                  {"Live ↗"}
                </a>
              </div>
            </div>

            <div className={"project-card"}>
              <span className={"project-badge full"}>{"Full Stack"}</span>

              <Image
                sizes="(max-width: 768px) 270px, 340px"
                className={
                  "project-preview project-preview--screen project-preview--shop"
                }
                src={"/assets/threft.png"}
                alt={
                  "Threft Nepal ShopCo catalog with product cards and category filters"
                }
                loading={"lazy"}
                width={"1342"}
                height={"697"}
              />

              <div className={"project-title"}>{"Threft Nepal"}</div>

              <p className={"project-desc"}>
                {
                  " E-commerce app with product upload/delete, cart, login & signup, and a separate admin dashboard. "
                }
              </p>

              <div className={"project-stack"}>
                <span>{"Next.js"}</span>
                <span>{"Auth"}</span>
                <span>{"Cart"}</span>
              </div>

              <div className={"project-links"}>
                <a
                  className={"live"}
                  href={"https://threftnepal.vercel.app"}
                  target={"_blank"}
                  rel={"noopener"}
                >
                  {"Live ↗"}
                </a>
              </div>
            </div>

            <div className={"project-card"}>
              <span className={"project-badge ai"}>{"AI / ML"}</span>

              <Image
                sizes="(max-width: 768px) 270px, 340px"
                className={
                  "project-preview project-preview--screen project-preview--stock"
                }
                src={"/assets/stockvolatility.png"}
                alt={
                  "Stock Vision Predictor upload and forecasting model interface"
                }
                loading={"lazy"}
                width={"953"}
                height={"404"}
              />

              <div className={"project-title"}>
                {"Stock Volatility Prediction"}
              </div>

              <p className={"project-desc"}>
                {
                  " Predicts stock volatility from historical data using classic ML models. "
                }
              </p>

              <div className={"project-stack"}>
                <span>{"Python"}</span>
                <span>{"Scikit-learn"}</span>
              </div>

              <div className={"project-links"}>
                <a
                  className={"live"}
                  href={"https://stockvolatilitydetector.vercel.app"}
                  target={"_blank"}
                  rel={"noopener"}
                >
                  {"Live ↗"}
                </a>
              </div>
            </div>

            <div className={"project-card"}>
              <span className={"project-badge full"}>{"Full Stack"}</span>

              <Image
                sizes="(max-width: 768px) 270px, 340px"
                className={
                  "project-preview project-preview--screen project-preview--services"
                }
                src={"/assets/itservices.png"}
                alt={
                  "IT Services website with Build a brighter tomorrow headline"
                }
                loading={"lazy"}
                width={"1236"}
                height={"493"}
              />

              <div className={"project-title"}>{"IT Services"}</div>

              <p className={"project-desc"}>
                {"React site for providing IT services."}
              </p>

              <div className={"project-stack"}>
                <span>{"PostgreSQL"}</span>
                <span>{"Express"}</span>
                <span>{"React"}</span>
                <span>{"Node"}</span>
              </div>

              <div className={"project-links"}>
                <a
                  className={"live"}
                  href={"https://onetyoneg.vercel.app"}
                  target={"_blank"}
                  rel={"noopener"}
                >
                  {"Live ↗"}
                </a>
              </div>
            </div>

            <div className={"project-card"}>
              <span className={"project-badge ai"}>{"AI / ML"}</span>

              <Image
                sizes="(max-width: 768px) 270px, 340px"
                className={"project-preview project-preview--photo"}
                src={"/assets/tomato.png"}
                alt={"Ripe red tomatoes among green leaves"}
                loading={"lazy"}
                width={"176"}
                height={"134"}
              />

              <div className={"project-title"}>
                {"Tomato Disease Detection"}
              </div>

              <p className={"project-desc"}>
                {
                  " CNN-based image classifier that detects tomato leaf disease, wrapped in a Flutter mobile app. "
                }
              </p>

              <div className={"project-stack"}>
                <span>{"TensorFlow"}</span>
                <span>{"CNN"}</span>
                <span>{"Flutter"}</span>
              </div>

              <div className={"project-links"}>
                <a
                  className={"code"}
                  href={"https://github.com/khembahadurchhetri"}
                  target={"_blank"}
                  rel={"noopener"}
                >
                  {"Code ↗"}
                </a>
              </div>
            </div>

            <div className={"project-card"}>
              <span className={"project-badge full"}>{"Cybersecurity"}</span>

              <Image
                sizes="(max-width: 768px) 270px, 340px"
                className={"project-preview project-preview--security"}
                src={"/assets/passwordmanagement.png"}
                alt={
                  "Android mascot with a colourful key representing password security"
                }
                loading={"lazy"}
                width={"261"}
                height={"193"}
              />

              <div className={"project-title"}>{"Security Toolkit"}</div>

              <p className={"project-desc"}>
                {
                  "A project concept bringing together network vulnerability assessment, password management, and password strength checking."
                }
              </p>

              <div className={"project-stack"}>
                <span>{"Network security"}</span>
                <span>{"Passwords"}</span>
              </div>

              <p className={"project-status"}>{"Details coming soon"}</p>
            </div>

            <div className={"project-card"}>
              <span className={"project-badge full"}>{"WordPress"}</span>

              <Image
                sizes="(max-width: 768px) 270px, 340px"
                className={"project-preview project-preview--photo"}
                src={"/assets/travelguide.png"}
                alt={
                  "Illustrated Himalayan peaks and a lake for the Nepal Travel Guide"
                }
                loading={"lazy"}
                width={"978"}
                height={"537"}
              />

              <div className={"project-title"}>{"Nepal Travel Guide"}</div>

              <p className={"project-desc"}>
                {
                  "A WordPress travel guide for exploring Nepal, with destinations, local experiences, and practical trip planning."
                }
              </p>

              <div className={"project-stack"}>
                <span>{"WordPress"}</span>
                <span>{"Travel"}</span>
              </div>

              <p className={"project-status"}>{"Link coming soon"}</p>
            </div>

            <div className={"project-card"}>
              <span className={"project-badge full"}>{"UI / UX"}</span>

              <Image
                sizes="(max-width: 768px) 270px, 340px"
                className={
                  "project-preview project-preview--screen project-preview--design"
                }
                src={"/assets/uuiuxx.png"}
                alt={
                  "Figma canvas with website layout explorations and mountain imagery"
                }
                loading={"lazy"}
                width={"416"}
                height={"353"}
              />

              <div className={"project-title"}>
                {"Interface Design Studies"}
              </div>

              <p className={"project-desc"}>
                {
                  "A collection of interface explorations, from aviation landing pages to responsive website layouts and visual systems."
                }
              </p>

              <div className={"project-stack"}>
                <span>{"Figma"}</span>
                <span>{"UI / UX"}</span>
              </div>

              <p className={"project-status"}>{"Case study coming soon"}</p>
            </div>

            <div className={"project-card"}>
              <div
                className={"project-preview studio-preview"}
                aria-hidden={"true"}
              >
                <span>{"JOURNAL STUDIO"}</span>
                <strong>
                  {"A little room"}
                  <br />
                  {"to create."}
                </strong>
                <small>{"Write · Upload · Publish"}</small>
              </div>

              <span className={"project-badge full"}>{"Full stack"}</span>

              <div className={"project-title"}>{"Journal Studio"}</div>

              <p className={"project-desc"}>
                {
                  "A personal publishing dashboard with owner authentication, photo and video uploads, and public, private or draft entries."
                }
              </p>

              <div className={"project-stack"}>
                <span>{"Node.js"}</span>
                <span>{"SQLite"}</span>
                <span>{"Authentication"}</span>
              </div>

              <div className={"project-links"}>
                <a className={"live"} href={"/admin"}>
                  {"Open Studio"}
                </a>
                <a className={"code"} href={"#journal"}>
                  {"Public journal"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
