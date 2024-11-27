'use client'

import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import ApartmentIcon from '@mui/icons-material/Apartment';

import { Autocomplete, CircularProgress, FormHelperText } from '@mui/joy';
import { getAllNoPagProspeccoes } from '@/shared/services/prospeccoes/prospeccoes.service';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

export default function ModalImovelId({ open, setOpen }: { open: boolean, setOpen: Function }) {
  const [ imoveisLabel, setImoveisLabel ] = React.useState<any>();
  const [ imovelId, setImovelId ] = React.useState<number | null>();
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ errror, setError ] = React.useState<boolean>(false);
  const router = useRouter();

  React.useEffect(() => {
    setLoading(true);
    getAllNoPagProspeccoes().then(r => {
      const lbl: any = [];
      r.forEach(r => {
        lbl.push({ label: r.enderecoLogradouro + ', ' + r.enderecoNumero, value: r.id });
      });
      setImoveisLabel(lbl);
      setLoading(false);
    });
  }, []);

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Associar imóvel</DialogTitle>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Logradouro</FormLabel>
                <Stack spacing={2}>
                  <Autocomplete
                    required
                    color={ errror && 'danger' || 'neutral' }
                    startDecorator={<ApartmentIcon />}
                    placeholder="Imóveis"
                    disabled={loading}
                    loading={loading}
                    endDecorator={loading && <CircularProgress size='sm' />}
                    options={imoveisLabel}
                    onChange={(e: any, selectedOption: any) => { 
                      selectedOption
                      ? setImovelId(selectedOption.value)
                      : setImovelId(null);
                      setError(false);
                    }}
                  />
                </Stack>
              </FormControl>
              {
                errror &&  
                <FormHelperText sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                  <InfoOutlined color='error' />
                  <Typography fontWeight={'bold'} fontSize={13} color={'error'}>
                    É obrigatório o envio de um imóvel.
                  </Typography>
                </FormHelperText>
              }
              <Button 
                type="submit" 
                onClick={(e) => {
                  e.preventDefault();
                  if (!imovelId) {
                    setError(true);
                    return
                  };
                  router.push('/vistoria/detalhes' + `?imovelId=${imovelId}`);
                }}
              >
                Associar
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
