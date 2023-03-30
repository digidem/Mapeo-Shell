import * as React from "react";
import * as Location from "expo-location";

export const PermissionsContext =
  React.createContext<Location.LocationPermissionResponse | null>(null);

export const PermissionsProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [response, setResponse] =
    React.useState<Location.LocationPermissionResponse | null>(null);

  React.useEffect(() => {
    Location.requestForegroundPermissionsAsync().then((response) => {
      setResponse(response);
    });
  }, []);

  return (
    <PermissionsContext.Provider value={response}>
      {children}
    </PermissionsContext.Provider>
  );
};
