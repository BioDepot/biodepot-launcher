// import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar';
import WorkflowPage from './pages/WorkflowPage';
import MarketplacePage from './pages/MarketplacePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useHasDocker from './hooks/useHasDocker';
import DependencyAlertModal from './components/DependencyAlertModal';
import useGetFileDetails from './hooks/useGetFileDetails';
import useWorkflowUpdates from './hooks/useWorkflowUpdates';
import { filesystem, os } from "@neutralinojs/lib";
import { 
  CATEGORIES, 
} from './constants';
import useHasAWS from './hooks/useHasAWS';
import useHasDM from './hooks/useHasDM';
import useHasBwb from './hooks/useHasBwb';
import useCheckRevert from './hooks/useCheckRevert';
import BwbAlertModal from './components/BwbAlertModal';

function App() {
  // The contents of the currently selected documentation
  const [selectedDoc, setSelectedDoc] = useState('');

  // our state variable for the selected documentation file
  const [selectedPage, setSelectedPage] = useState("Workflow repository");

  const [allDependencies, setAllDependencies] = useState(true);
  const [modalClosed, setModalClosed] = useState(false);

  // Determines which dependencies are installed or not
  let hasDocker = null;
  hasDocker = useHasDocker();

  let hasAWS = null;
  hasAWS = useHasAWS();

  let hasDM = null;
  hasDM = useHasDM();

  useEffect(() => { 
    if (hasDocker !== null && hasAWS !== null && hasDM !== null ) {
      if (!hasDocker || !hasAWS || !hasDM) {
        setAllDependencies(false);
      }
    }
  }, [hasDocker, hasAWS, hasDM]);

  let hasBwb = null;
  hasBwb = useHasBwb();

  // Ensures that we have a folder ready for each workflow category
  const runInit = async () => {
    const dirEntries = await filesystem.readDirectory('./');
    const dirEntriesByName = dirEntries.map((x) => x.entry);
    const readyStatus = CATEGORIES.every((category) => dirEntriesByName.includes(category));
    const missingDirs = CATEGORIES.filter((category) => !dirEntriesByName.includes(category));
    if (!readyStatus) {
      for (const category of missingDirs) {
        await filesystem.createDirectory(`./${category}`);
      }
    }
    // Ensures that we have a .storage folder
    if (!dirEntriesByName.includes('.storage')) {
      await os.execCommand('mkdir .storage').catch((e) => console.log(e));
    }
  };

  runInit();

  // Gathers which workflows have an update
  let needsUpdates = useWorkflowUpdates();
  // Gathers the file details of all workflows
  const fileDetails = useGetFileDetails();
  // Gathers which workflows can be reverted
  let canRevert = useCheckRevert();

  const openBwbUpdate = async () => {
    if (!hasBwb && hasDocker) {
      <BwbAlertModal />
    }
  }

  return (
    <main className="d-flex flex-nowrap h-100">
      <Router>
        { allDependencies ? setModalClosed(true) : <DependencyAlertModal show={!hasDocker || !hasAWS || !hasDM} hasDocker={hasDocker} hasAWS={hasAWS} hasDM={hasDM} openBwbUpdate={openBwbUpdate}/> }
        { modalClosed ? openBwbUpdate() : null }
        <Sidebar
          selectedPage={selectedPage} 
          setSelectedPage={setSelectedPage} 
        />
        <Routes>
          {fileDetails ? <Route path="/" exact element={<MarketplacePage fileDetails={fileDetails} />}></Route> : <Route path="/" ></Route> }
          <Route 
            path="/workflow-category" 
            exact 
            element={<WorkflowPage setSelectedDoc={setSelectedDoc} selectedPage={selectedPage} needsUpdates={needsUpdates} canRevert={canRevert} fileDetails={fileDetails}/>}
          ></Route>
        </Routes>
      </Router>
    </main>
  );
};

export default App;