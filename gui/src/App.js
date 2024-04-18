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
import useHasBwb from './hooks/useHasBwb';
import useCheckRevert from './hooks/useCheckRevert';

function App() {
  // The contents of the currently selected documentation
  const [selectedDoc, setSelectedDoc] = useState('');

  // our state variable for the selected documentation file
  const [selectedPage, setSelectedPage] = useState("Workflow repository");

  const [allDependencies, setAllDependencies] = useState(true);
  const [allChecks, setAllChecks] = useState(false);
  const [loadContent, setLoadContent] = useState(false);

  // Determines which dependencies are installed or not
  let hasDocker = null;
  hasDocker = useHasDocker();

  let hasAWS = null;
  hasAWS = useHasAWS();

  let hasBwb = null;
  hasBwb = useHasBwb();


  const test = async () => {
    if (window.NL_OS === "Windows") {
      let pwd = (await os.execCommand('$PWD')).stdOut;
      pwd = pwd.replace("\\", "\/");
      alert(pwd);
    }
  }
  
  test();

  useEffect(() => { 
    if (hasDocker !== null && hasAWS !== null && hasBwb !== null) {
      setAllChecks(true);
      if (!hasDocker || !hasAWS || !hasBwb) {
        setAllDependencies(false);
      }
    }
  }, [hasDocker, hasAWS, hasBwb]);

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
  let needsUpdates = null;
  needsUpdates = useWorkflowUpdates();
  // Gathers the file details of all workflows
  let fileDetails = null;
  fileDetails = useGetFileDetails();
  // Gathers which workflows can be reverted
  let canRevert = null;
  canRevert = useCheckRevert();

  useEffect(() => { 
    if (needsUpdates !== null && fileDetails !== null&& canRevert !== null) {
      setLoadContent(true);
    }
  }, [needsUpdates, fileDetails, canRevert]);


  return (
    <main className="d-flex flex-nowrap h-100">
      { allDependencies ? null : <DependencyAlertModal hasBwb={hasBwb} hasDocker={hasDocker} hasAWS={hasAWS} /> }
      { allChecks && loadContent ?
      <Router>
        <Sidebar
          selectedPage={selectedPage} 
          setSelectedPage={setSelectedPage} 
        />
        <Routes>
          <Route path="/" exact element={<MarketplacePage fileDetails={fileDetails} />}></Route> : <Route path="/" ></Route>
          <Route 
            path="/workflow-category" 
            exact 
            element={<WorkflowPage
                        hasBwb={hasBwb}
                        hasDocker={hasDocker}
                        setSelectedDoc={setSelectedDoc}
                        selectedPage={selectedPage}
                        needsUpdates={needsUpdates}
                        canRevert={canRevert}
                        fileDetails={fileDetails}
                    />}
          ></Route>
        </Routes>
      </Router> :
      <div>
        <text>Loading workflows, please wait a moment...</text>
      </div> }
    </main>
  );
};

export default App;