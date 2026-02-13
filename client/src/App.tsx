
import Tutorials from "./pages/Tutorials";
import Embed from "./pages/Embed";
import Portal from "./pages/Portal";
import Membership from "./pages/Membership";
import About from "./pages/About";
import SeasonalVault from "./pages/SeasonalVault";
import SupplySuite from "./pages/SupplySuite";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home"
import TutorialDetail from "@/pages/TutorialDetail";
import Upload from "@/pages/Upload";
import Saved from "@/pages/Saved";

function Router() {
  return (
    <Switch>
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/embed" component={Embed} />
      <Route path="/portal" component={Portal} />
      <Route path="/membership" component={Membership} />
      <Route path="/about" component={About} />
      <Route path="/" component={Home} />
      <Route path="/tutorial/:id" component={TutorialDetail} />
      <Route path="/upload" component={Upload} />
      <Route path="/saved" component={Saved} />
      <Route path="/seasonal" component={SeasonalVault} />
      <Route path="/supplies" component={SupplySuite} />
      <Route component={NotFound} />
    </Switch>
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

export default App;