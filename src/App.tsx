/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { MasterComparison } from './pages/MasterComparison';
import { LanguageTraining } from './pages/LanguageTraining';
import { LiveStreaming } from './pages/LiveStreaming';
import { LiveAgriculture } from './pages/LiveAgriculture';
import { LiveTourism } from './pages/LiveTourism';
import { ImpromptuChallenge } from './pages/ImpromptuChallenge';
import { SelfPresentation } from './pages/SelfPresentation';

export type Page = 'master' | 'training' | 'live' | 'live-agriculture' | 'live-tourism' | 'impromptu' | 'presentation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('master');

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'master' && <MasterComparison />}
      {currentPage === 'training' && <LanguageTraining />}
      {currentPage === 'impromptu' && <ImpromptuChallenge />}
      {currentPage === 'presentation' && <SelfPresentation />}
      {currentPage === 'live' && <LiveStreaming />}
      {currentPage === 'live-agriculture' && <LiveAgriculture />}
      {currentPage === 'live-tourism' && <LiveTourism />}
    </Layout>
  );
}
