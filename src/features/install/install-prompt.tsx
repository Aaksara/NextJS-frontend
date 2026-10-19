'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

/** Chromium-only event, not yet in lib.dom.d.ts. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const STANDALONE_QUERY = '(display-mode: standalone)';

function subscribeToDisplayMode(onChange: () => void) {
  const query = window.matchMedia(STANDALONE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function isStandalone(): boolean {
  const iosStandalone = 'standalone' in navigator && navigator.standalone === true;
  return window.matchMedia(STANDALONE_QUERY).matches || iosStandalone;
}

const noopSubscribe = () => () => {};

function isIOS(): boolean {
  const { userAgent, maxTouchPoints } = navigator;
  // iPadOS 13+ reports a desktop Safari user agent.
  return /iPad|iPhone|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1);
}

export function InstallPrompt() {
  const installed = useSyncExternalStore(subscribeToDisplayMode, isStandalone, () => true);
  const ios = useSyncExternalStore(noopSubscribe, isIOS, () => false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => setInstallEvent(null);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (installed || (!installEvent && !ios)) return null;

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    // The event can only be used once.
    setInstallEvent(null);
  }

  return (
    <section className="panel" aria-labelledby="install-heading">
      <h2 id="install-heading">Install app</h2>
      {installEvent ? (
        <button type="button" onClick={handleInstall}>
          Add to home screen
        </button>
      ) : (
        <p>
          To install, tap the Share button in Safari and choose <strong>Add to Home Screen</strong>.
        </p>
      )}
    </section>
  );
}
