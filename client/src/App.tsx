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