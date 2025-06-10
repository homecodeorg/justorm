import { h } from 'preact';
import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';

import connector from '../connector';
import { createConnectedStore } from '../create';

import { createStore as _createStore } from '../';

function createUpdater(instance: any) {
  return () => instance.setState({ _justorm: Date.now() });
}

export function createStore(instance: any, obj: any) {
  if (typeof instance === 'string') return _createStore(instance, obj);
  return createConnectedStore(obj, createUpdater(instance));
}
