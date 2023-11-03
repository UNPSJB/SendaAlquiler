import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Props as ReactSelectProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { CreateBrandMutation, Brand } from '@/api/graphql';
import { useBrand } from '@/api/hooks';