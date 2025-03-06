import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * A hook that handles automatic fetching of data when the component is mounted
 * and refetching of data when the component is remounted.
 *
 * @param {Object} options - options object
 * @param {Function} options.fetchAction - a function to dispatch to fetch the data
 * @param {Function} options.fetchCompleteSelector - a selector that determines if the data has been fetched
 * @param {Function} options.loadingSelector - a selector that determines if the data is being fetched
 * @param {Function} options.errorSelector - a selector that determines if there is an error with the fetch
 * @param {Function} options.refetchSelector - a selector that determines if the data needs to be refetched
 */
export default function useReduxFetch({
  fetchAction,
  fetchCompleteSelector,
  loadingSelector,
  errorSelector,
  refetchSelector = () => {},
}) {
  const dispatch = useDispatch();
  const isComplete = useSelector(fetchCompleteSelector);
  const isLoading = useSelector(loadingSelector);
  const hasError = useSelector(errorSelector);
  const refetchNeeded = useSelector(refetchSelector);

  useEffect(() => {
    if (!isComplete && !isLoading && !hasError) {
      dispatch(fetchAction());
    }
  }, [isComplete, isLoading, hasError, dispatch, fetchAction]);

  useEffect(() => {
    if (refetchNeeded) {
      dispatch(fetchAction());
    }
  }, [refetchNeeded, dispatch, fetchAction]);
}
