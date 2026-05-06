import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout"; 

// Page Imports
import Home from "@/pages/Home";
import Styles from "@/pages/Styles";
import Contact from "@/pages/Contact";
import ContentEditing from "@/pages/ContentEditing";
import Creators from "@/pages/Creators";
import CreatorProfile from "@/pages/CreatorProfile";
import Admin from "./pages/Admin";
import TechRegister from "./pages/TechRegister";
import FindTech from "./pages/FindTech";
import Gallery from "./pages/Gallery";
import Tutorials from "./pages/Tutorials";
import TutorialDetail from "@/pages/TutorialDetail";
import Embed from "./pages/Embed";
import Portal from "./pages/Portal";
import About from "./pages/About";
import SeasonalVault from "./pages/SeasonalVault";
import SupplySuite from "./pages/SupplySuite";
import Login from "./pages/Login";
import Upload from "@/pages/Upload";
import Saved from "@/pages/Saved";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Subscribe from "@/pages/Subscribe";

/**
 * Nail Check: Master Router
 * This handles the seamless transitions between the Studio and the Lab.
 */
function Router() {
  return (
    <Layout>
      <Switch>
        {/* Primary Studio Routes */}
        <Route path="/" component={Home} />
        <Route path="/styles" component={Styles} />
        <Route path="/contact" component={Contact} />
        {/* Design Lab aliases — /styles is the Design Lab */}
        <Route path="/design-lab">{() => <Redirect to="/styles" />}</Route>
        <Route path="/ai-generate">{() => <Redirect to="/styles" />}</Route>
        <Route path="/critique">{() => <Redirect to="/styles" />}</Route>
        {/* AI & Content Lab */}
        <Route path="/ai-critique">{() => <Redirect to="/styles" />}</Route>
        <Route path="/content-editing" component={ContentEditing} />
        
        {/* Community & Creators */}
        <Route path="/creators" component={Creators} />
        <Route path="/creators/:username" component={CreatorProfile} />
        <Route path="/gallery" component={Gallery} />
        
        {/* Technician Ecosystem */}
        <Route path="/find-tech" component={FindTech} />
        <Route path="/tech-register" component={TechRegister} />
        
        {/* Education & Tutorials */}
        <Route path="/tutorials" component={Tutorials} />
        <Route path="/tutorial/:id" component={TutorialDetail} />
        
        {/* Personal Vaults */}
        <Route path="/saved" component={Saved} />
        <Route path="/upload" component={Upload} />
        <Route path="/seasonal" component={SeasonalVault} />
        <Route path="/supplies" component={SupplySuite} />
        
        {/* Membership & Auth */}
        <Route path="/login" component={Login} />
        <Route path="/membership">{() => <Redirect to="/subscribe" />}</Route>
        <Route path="/subscribe" component={Subscribe} />
        <Route path="/portal" component={Portal} />
        <Route path="/about" component={About} />
        
        {/* Legal */}
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />

        {/* System Routes */}
        <Route path="/admin" component={Admin} />
        <Route path="/embed" component={Embed} />

        {/* Fallback */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;"// Force rebuild" 
