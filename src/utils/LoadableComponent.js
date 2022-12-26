import React from "react";
import Loadable from "react-loadable";
import Loading from "@/components/Loading";

const LoadableComponent = (component, haveLoading = false) => {
  return Loadable({
    loader: () => component,
    loading: () => {
      if (haveLoading) {
        return (
          <Loading
            style={{ background: "none", height: "calc(100vh - 173px)" }}
          />
        );
      }
      return null;
    },
  });
};

export default LoadableComponent;
