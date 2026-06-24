/**
 * ConversionManager コンポーネント
 * ファイルアップロード、設定、変換処理を統合管理。
 *
 * WebP はブラウザがネイティブにデコードするため、専用ワーカーは使わず
 * メインスレッドで変換する（imageConvert.ts、全ブラウザで動作）。
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'preact/hooks';
import { SettingsPanel } from './SettingsPanel';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { AppModal } from './AppModal';
import { ToastNotification } from './ToastNotification';
import { ErrorToast } from './ErrorToast';
import { convertImage } from '@/utils/imageConvert';
import { type ConversionSettings } from '@/utils/settings';
import { loadSettings, saveSettings } from '@/utils/settingsStorage';
import { downloadSingleFile } from '@/utils/zipDownload';
import { ui } from '@/i18n/ui';
import type { ConversionJob } from '@/workers/types';

interface ErrorToastItem {
  id: string;
  message: string;
}

/**
 * WebP ファイルかどうかを判定
 */
function isWebPFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.webp') || file.type.toLowerCase() === 'image/webp';
}

interface ConversionManagerProps {
  locale?: string;
}

export function ConversionManager({ locale = 'en' }: ConversionManagerProps) {
  const t = (ui as any)[locale] ?? ui.en;
  const [settings, setSettings] = useState<ConversionSettings>(() => loadSettings());
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const downloadedJobIdsRef = useRef<Set<string>>(new Set());
  const erroredJobIdsRef = useRef<Set<string>>(new Set());
  const [failedDownloads, setFailedDownloads] = useState<ConversionJob[]>([]);
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);

  // 統計はジョブから導出（ワーカーが無いので集計のみ）。
  const stats = useMemo(() => {
    const by = (s: string) => jobs.filter((j) => j.status === s).length;
    return {
      total: jobs.length,
      succeeded: by('succeeded'),
      failed: by('failed'),
      processing: by('processing'),
      pending: by('pending'),
      averageSpeed: 0,
    };
  }, [jobs]);

  const upsertJob = useCallback((job: ConversionJob) => {
    setJobs((prev) => {
      const i = prev.findIndex((j) => j.id === job.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = job;
        return next;
      }
      return [...prev, job];
    });
  }, []);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setErrorToasts((prev) => [...prev, { id, message }]);
  }, []);

  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ハイドレーション完了 = 変換を受け付けられる（E2E の準備完了シグナル）。
  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  // 完了したジョブを自動ダウンロード
  useEffect(() => {
    jobs.forEach((job) => {
      if (job.status === 'succeeded' && job.result && !downloadedJobIdsRef.current.has(job.id)) {
        try {
          downloadSingleFile(job);
          downloadedJobIdsRef.current.add(job.id);
        } catch (error) {
          console.error(`${job.file.name} の自動ダウンロードに失敗:`, error);
          setFailedDownloads((prev) =>
            prev.find((j) => j.id === job.id) ? prev : [...prev, job]
          );
        }
      }
    });
  }, [jobs]);

  // 変換失敗をトーストで通知
  useEffect(() => {
    jobs.forEach((job) => {
      if (job.status === 'failed' && !erroredJobIdsRef.current.has(job.id)) {
        erroredJobIdsRef.current.add(job.id);
        showErrorToast(`${job.file.name}: ${job.error ?? t.errConversionFailed}`);
      }
    });
  }, [jobs, showErrorToast]);

  // 設定変更時に自動保存
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // 1 ファイルを変換（メインスレッド）
  const processFile = useCallback(
    async (file: File) => {
      const id = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const settings = settingsRef.current;
      const base: ConversionJob = {
        id,
        file,
        settings,
        status: 'processing',
        phase: 'encode',
        progress: 0,
        startTime: Date.now(),
      };
      upsertJob(base);
      try {
        const result = await convertImage(file, settings);
        upsertJob({
          ...base,
          status: 'succeeded',
          progress: 100,
          result: result.blob,
          endTime: Date.now(),
        });
      } catch (error) {
        upsertJob({
          ...base,
          status: 'failed',
          error: error instanceof Error ? error.message : t.errConversionFailed,
          endTime: Date.now(),
        });
      }
    },
    [upsertJob, t]
  );

  // ファイルが選択された時 - 即座に変換開始
  const handleFilesSelected = useCallback(
    async (newFiles: File[]) => {
      for (const file of newFiles) {
        if (!isWebPFile(file)) {
          showErrorToast(t.errUnsupported.replace('{name}', file.name));
          continue;
        }
        await processFile(file);
      }
      window.dispatchEvent(new CustomEvent('filesProcessed'));
    },
    [processFile, showErrorToast, t]
  );

  // グローバルドロップゾーンからのファイルドロップを受信
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<File[]>;
      handleFilesSelected(customEvent.detail);
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFilesSelected]);

  // 単一ファイルをダウンロード
  const handleDownload = (job: ConversionJob) => {
    try {
      downloadSingleFile(job);
      downloadedJobIdsRef.current.add(job.id);
      setFailedDownloads((prev) => prev.filter((j) => j.id !== job.id));
    } catch (error) {
      alert(error instanceof Error ? error.message : t.errDownloadFailed);
    }
  };

  const handleClearFailedDownloads = () => setFailedDownloads([]);

  return (
    <div>
      {/* ファイルアップロード */}
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h3 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h3>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <div
          style={{
            padding: 'var(--space-6)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            marginBottom: 'var(--space-4)',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div style="font-size: 3rem; margin-bottom: var(--space-2);">📁</div>
          <div style="font-size: var(--fs-3); font-weight: 600; margin-bottom: var(--space-2);">
            {t.dropClick}
          </div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle);">
            {t.dropOr}
          </div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-1);">
            {t.dropSupported}
          </div>
          <input
            id="file-input"
            type="file"
            accept=".webp,image/webp"
            multiple
            onChange={(e) => {
              const selectedFiles = Array.from(e.currentTarget.files || []);
              handleFilesSelected(selectedFiles);
            }}
            style="display: none;"
          />
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button
            onClick={() => setIsSettingsOpen(true)}
            aria-label={t.openSettingsAria}
            style="background: none; border: none; font-size: var(--fs-2); cursor: pointer; padding: var(--space-2); border-radius: var(--radius-sm); transition: all var(--dur-mid) var(--ease); color: var(--color-primary); font-weight: 500;"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary-alpha)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            {t.settingsButton}
          </button>
        </div>
      </AppCard>

      {/* 統計情報バー */}
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3); margin-top: var(--space-6); padding: var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
        <div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle);">{t.statTotal}</div>
          <div style="font-size: var(--fs-4); font-weight: 600;" class="num">{stats.total}</div>
        </div>
        <div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle);">{t.statProcessing}</div>
          <div style="font-size: var(--fs-4); font-weight: 600; color: var(--color-primary);" class="num">{stats.processing}</div>
        </div>
        <div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle);">{t.statDone}</div>
          <div style="font-size: var(--fs-4); font-weight: 600; color: var(--color-success);" class="num">{stats.succeeded}</div>
        </div>
        <div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle);">{t.statFailed}</div>
          <div style="font-size: var(--fs-4); font-weight: 600; color: var(--color-danger);" class="num">{stats.failed}</div>
        </div>
      </div>

      {/* ダウンロード失敗リスト */}
      {failedDownloads.length > 0 && (
        <AppCard title={t.failedDownloadTitle} description={t.failedDownloadDesc} className="mt-6">
          <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-4);">
            <AppButton variant="secondary" onClick={handleClearFailedDownloads}>
              {t.clearAll}
            </AppButton>
          </div>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            {failedDownloads.map((job) => (
              <div
                key={job.id}
                style="padding: var(--space-4); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;"
              >
                <div>
                  <strong>{job.file.name}</strong>
                  <div style="font-size: var(--fs-2); color: var(--color-subtle); margin-top: var(--space-1);">
                    {t.convertedManual}
                  </div>
                </div>
                <AppButton variant="primary" onClick={() => handleDownload(job)}>
                  {t.download}
                </AppButton>
              </div>
            ))}
          </div>
        </AppCard>
      )}

      {/* トースト通知コンテナ */}
      <div className="toast-container">
        {jobs.filter((job) => job.status === 'processing' || job.status === 'pending').map((job) => (
          <ToastNotification key={job.id} job={job} locale={locale} />
        ))}
      </div>

      {/* エラートースト通知 */}
      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              onClose={removeErrorToast}
              locale={locale}
            />
          ))}
        </div>
      )}

      {/* 設定モーダル */}
      <AppModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title={t.conversionSettings}
        locale={locale}
      >
        <SettingsPanel settings={settings} onChange={setSettings} locale={locale} />
      </AppModal>
    </div>
  );
}
