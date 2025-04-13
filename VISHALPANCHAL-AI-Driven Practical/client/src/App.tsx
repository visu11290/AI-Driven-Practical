import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ShiftManagement from "@/pages/ShiftManagement";
import MaterialUIShiftManagement from "@/pages/MaterialUIShiftManagement";
import { Provider } from "react-redux";
import { store } from "./store/store";

function Router() {
  const [location] = useLocation();

  return (
    <>
      {/* UI Variation Switcher */}
      <div className="bg-gray-100 text-center py-2 border-b">
        <div className="container mx-auto">
          <span className="mr-2 text-sm font-medium">UI Variations:</span>
          <Link href="/">
            <span className={`text-sm px-3 py-1 rounded-md mr-2 inline-block cursor-pointer ${location === '/' ? 'bg-primary text-white' : 'bg-white'}`}>
              Default UI
            </span>
          </Link>
          <Link href="/material-ui">
            <span className={`text-sm px-3 py-1 rounded-md inline-block cursor-pointer ${location === '/material-ui' ? 'bg-primary text-white' : 'bg-white'}`}>
              Material UI Style
            </span>
          </Link>
        </div>
      </div>

      <Switch>
        {/* Add pages */}
        <Route path="/" component={ShiftManagement}/>
        <Route path="/material-ui" component={MaterialUIShiftManagement}/>
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
