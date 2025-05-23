import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { FaChevronRight } from 'react-icons/fa';
import { Header, Bottom } from '../../App';
import { useEffect, useState } from 'react';
import { api } from '../../api';
import './Summary.css';

import { useAtomValue } from 'jotai';
import { userTokenAtom } from '../../atoms';

type Asset = {
  ticker: string;
  name: string;
};

const IrSummary: React.FC = () => {
  const navigate = useNavigate();

  const [fiis, setFiis] = useState<Asset[]>([]);
  const [stocks, setStocks] = useState<Asset[]>([]);

  const userToken = useAtomValue(userTokenAtom);

  useEffect(() => {
    const exec = async () => {
      const response = await api.get<{
        assets: { fiis: Asset[]; stocks: Asset[] };
      }>('/ir', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { fiis, stocks } = response.data.assets;
      setFiis(fiis);
      setStocks(stocks);
    };

    exec();
  }, [userToken]);

  const TableHeader = ({ title }: { title: string }) => (
    <Box sx={{ backgroundColor: '#006D35', padding: '8px' }}>
      <Typography variant="h6" align="left" fontWeight="bold" color="#fff">
        {title}
      </Typography>
    </Box>
  );

  const TableRow = ({
    asset,
    rowIndex,
  }: {
    asset: Asset;
    rowIndex: number;
  }) => {
    const backgroundColor = rowIndex % 2 === 0 ? '#ffffff' : '#dedede';

    return (
      <>
        <Box
          sx={{
            backgroundColor,
            padding: '8px',
            ':hover': { cursor: 'pointer' },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onClick={() => {
            navigate(`/ir/${asset.ticker}`);
          }}
        >
          <Typography variant="body1" align="left" fontWeight={400}>
            {asset.ticker} - {asset.name}
          </Typography>
          <FaChevronRight />
        </Box>
      </>
    );
  };

  const AssetTable = ({
    assets,
    title,
  }: {
    assets: Asset[];
    title: string;
  }) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <TableHeader title={title} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {assets.map((stock, index) => (
            <TableRow key={stock.ticker} asset={stock} rowIndex={index} />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <>
      {Header()}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          margin: '192px 0 0 0',
        }}
        className="ir-summary"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '32px',
            maxWidth: '1296px',
            margin: '0 auto',
          }}
        >
          <Typography variant="h4" align="center">
            IRPF - Bens e Direitos & Rendimentos
          </Typography>
          <Typography variant="body1">
            A lista abaixo inclui ativos que devem ser declarados na seção de
            Bens e Direitos. Clique no ativo para ver todas as informações para
            as seções de Bens e Direitos, Rendimentos Isentos e Não Tributáveis,
            e Rendimentos Sujeitos à Tributação Exclusiva/Definitiva.
          </Typography>
          <AssetTable assets={stocks} title="Ações" />
          <AssetTable assets={fiis} title="Fundos Imobiliários" />
        </Box>
      </Box>
      {Bottom()}
    </>
  );
};

export default IrSummary;
