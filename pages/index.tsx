import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Interface } from "readline";

const steps = {
  WORK: { id: 1, mm: 25 },
  REST: { id: 2, mm: 5 },
  LONG_REST: { id: 3, mm: 15 },
};

interface stepInterface {
  id: number;
  mm: number;
}

const stepsToLongRest = 4;

const initialState = {
  step: steps.WORK.id,
  initialized: false,
  interval: undefined,
  mm: 25,
  ss: 0,
  countSteps: 0,
};

export default function Home() {
  const [
    { step, initialized, interval, mm, ss, countSteps },
    setState,
  ] = useState(initialState);

  const getTime = () => {
    const mins = mm < 10 ? "0" + mm.toString() : mm.toString();
    const secs = ss < 10 ? "0" + ss.toString() : ss.toString();
    return mins + ":" + secs;
  };

  const MinusSec = () => {
    // console.log({ mm, ss });
    if (ss === 0) {
      if (mm === 0) {
        let nextStep;
        let nextMM;
        if (step === steps.WORK.id) {
          const numStep = countSteps;
          setState((prevState) => ({
            ...prevState,
            countSteps: countSteps + 1,
          }));
          if (numStep + 1 === stepsToLongRest) {
            nextStep = steps.LONG_REST.id;
            nextMM = steps.LONG_REST.mm;
            setState((prevState) => ({ ...prevState, countSteps: 0 }));
          } else {
            nextStep = steps.REST.id;
            nextMM = steps.REST.mm;
          }
        } else {
          nextStep = steps.WORK.id;
          nextMM = steps.WORK.mm;
        }

        setState((prevState) => ({
          ...prevState,
          step: nextStep,
          mm: nextMM,
          ss: 0,
        }));
      } else {
        setState((prevState) => ({ ...prevState, mm: mm - 1, ss: 59 }));
      }
    } else {
      setState((prevState) => ({ ...prevState, ss: ss - 1 }));
    }
    // console.log({mm, ss});
    document.getElementById("time").innerHTML = getTime();
  };

  useEffect(() => {
    if (initialized) {
      setState((prevState) => ({
        ...prevState,
        initialized: true,
        interval: setInterval(() => {
          MinusSec();
        }, 1000),
      }));
    }

    return () => clearInterval(interval);
  }, [initialized, mm, ss]);

  const Stop = () => {
    console.log(interval);

    useEffect(() => {
      clearInterval(interval);
    }, []);
    setState((prevState) => ({ ...prevState, initialized: false }));
  };

  const SetTime = (setStep: stepInterface) => {
    const { mm, id } = setStep;
    setState((prevState) => ({ ...prevState, mm: mm, ss: 0, step: id }));
    document.getElementById("time").innerHTML =
      mm > 10 ? mm.toString() + ":00" : "0" + mm.toString() + ":00";
  };

  return (
    <div
      className={`${styles.container} ${
        step === steps.WORK.id
          ? styles.work
          : step === steps.REST.id
          ? styles.rest
          : styles.longRest
      }`}
    >
      <Head>
        <title>Pomodoro Timer</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />

        <meta charSet="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/iconx/favicon-16x16.png" sizes="16x16"/>
        <link rel="icon" type="image/png" href="/iconx/favicon-32x32.png" sizes="32x32"/>
        <link rel="icon" type="image/png" href="/iconx/android-192x192.png" sizes="192x192"/>
        <link rel="apple-touch-icon" href="/iconx/apple-touch-icon-180x180.png" sizes="180x180"/>
        <meta name="msapplication-config" content="/iconx/browserconfig.xml"></meta>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <div className={styles.header}>
        <h2 className={styles.title}>Pomodoro Timer</h2>
      </div>
      <main className={`${styles.main}`}>
        <div className={styles.timer}>
          <div className={styles.steps}>
            <div
              className={`${styles.step} ${
                step === steps.WORK.id ? styles.selected : ""
              }`}
              onClick={() => SetTime(steps.WORK)}
            >
              Work
            </div>
            <div
              className={`${styles.step} ${
                step === steps.REST.id ? styles.selected : ""
              }`}
              onClick={() => SetTime(steps.REST)}
            >
              Break
            </div>
            <div
              className={`${styles.step} ${
                step === steps.LONG_REST.id ? styles.selected : ""
              }`}
              onClick={() => SetTime(steps.LONG_REST)}
            >
              Long Break
            </div>
          </div>

          <div className={styles.time} id="time">
            25:00
          </div>

          <div className={styles.buttons}>
            <Button
              variant="contained"
              className={`${styles.button} ${
                step === steps.WORK.id
                  ? styles.work
                  : step === steps.REST.id
                  ? styles.rest
                  : styles.longRest
              }`}
              onClick={() =>
                setState((prevState) => ({
                  ...prevState,
                  initialized: !initialized,
                }))
              }
            >
              {initialized ? "Pause" : "Start"}
            </Button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
