<script lang="ts">
	import { parse } from 'csv-parse/browser/esm/sync';
	import ErrorBox from './ErrorBox.svelte';
	import { browser } from '$app/environment';
	import Button from './Button.svelte';
	import TextLabel from './TextLabel.svelte';
	import { getDocUrl } from '$lib';
	import Spinner from './Spinner.svelte';
	import { goto, invalidate } from '$app/navigation';
	import type { PageData } from '../../routes/$types';

	const { project, ...data } = $props();

	const projectId = project.id;
	const supabase = data.supabase;
	let rows = $state<any[][]>([]);
	let previewHeader = $state<any>([]);
	let previewRows = $state<any[][]>([]);
	let uploading = $state(false);
	let files = $state<FileList>();

	let fileName = $state('');
	let docUrl = $state('');
	let pptUrl = $state('');
	let pdfUrl = $state('');
	let showDocIcon = $state(false);
	let showPptIcon = $state(false);
	let showPdfIcon = $state(false);

	let hasHeader = $state(true);
	let sentenceIdColIdx = $state(null);
	let sourceColIdx = $state(null);
	let targetColIdx = $state(null);
	let paragraphIdColIdx = $state(null);

	let errorMsg = $state<string>('');
	let loading = $state(false);

	const BUCKET = 'docs';

	let isDragging = $state(false);

	const triggerUpload = async () => {
		if (browser) {
			const el = document.getElementById('csv-uploader');
			el?.click();
		}
	};

	const handleDragOver = (event: DragEvent) => {
		isDragging = true;
	};

	const handleDragLeave = (event: DragEvent) => {
		isDragging = false;
	};

	const handleDrop = async (event: DragEvent) => {
		isDragging = false;
		const files = event.dataTransfer?.files;

		if (!files || files.length === 0) return;

		const file = files[0];
		if (
			!file.name.toLowerCase().endsWith('.docx') &&
			!file.name.toLowerCase().endsWith('.pptx') &&
			!file.name.toLowerCase().endsWith('.pdf')
		) {
			errorMsg = 'Please upload a .docx, .pdf or .pptx file'
			return;
		}

		// Create a new event with the file
		const input = document.getElementById('csv-uploader') as HTMLInputElement;
		if (input) {
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			input.files = dataTransfer.files;
			handleFileSelect({ target: input });
		}
	};

	const handleFileSelect = async (evt: Event | { target: HTMLInputElement }) => {
		const target = evt.target as HTMLInputElement;
		files = target.files || undefined;
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw 'You must select a file to upload.'
			}

			const file = files[0];
			const fileExt = file.name.split('.').pop()?.toLowerCase();
			fileName = file.name;

			if (fileExt !== 'docx' && fileExt !== 'pptx' && fileExt !== 'pdf') {
				throw 'Please upload a .docx, .pdf or .pptx file'
			}

			const filePath = `${Math.random()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file);

			if (uploadError) throw uploadError;

			if (fileExt.toLowerCase() === 'docx') {
				docUrl = getDocUrl(filePath);
				showDocIcon = true;
			} else if (fileExt.toLowerCase() === 'pptx') {
				pptUrl = getDocUrl(filePath);
				showPptIcon = true;
			} else if (fileExt.toLowerCase() === 'pdf') {
				pdfUrl = getDocUrl(filePath);
				showPdfIcon = true;
			}
		} catch (error) {
		
			if (error instanceof Error) {
				errorMsg = error.message
			} else {
				errorMsg = error as string
			}
		} finally {
			uploading = false;
		}
	};

	const upload = async () => {
		if (sourceColIdx == null) errorMsg = 'Please choose a source column';

		if (sentenceIdColIdx == sourceColIdx)
			errorMsg = 'Please choose a different sentence ID column from the source column';

		if (targetColIdx == sourceColIdx)
			errorMsg = 'Please choose a different target column from the source column';

		if (errorMsg.length > 0) return;
		errorMsg = '';

		loading = true;

		let items: ROWS[] = [];
		rows.forEach((row, index) => {
			let shouldAdd = true;
			if (hasHeader && index == 0) shouldAdd = false;

			if (shouldAdd)
				items.push({
					order_id: index,
					source: sourceColIdx ? row[sourceColIdx] : '',
					target: targetColIdx ? row[targetColIdx] : '',
					paragraph_id: paragraphIdColIdx ? row[paragraphIdColIdx] : null,
					status: 'DRAFT',
					project_id: projectId
				});
		});

		const data = await fetch(`/api/translations/upload-csv`, {
			method: 'POST',
			body: JSON.stringify({ items: items })
		});

		loading = false;
	};

	const uploadDocx = async () => {
		loading = true;

		const response = await fetch('/api/translations/documents/upload-docx', {
			method: 'POST',
			body: JSON.stringify({
				project_id: projectId,
				// document_id: documentId,
				doc_url: docUrl
			})
		});
		const { doc_url_key, error } = await response.json();

		if (error) {
			errorMsg = error;
		} else {
			await goto(`/project/${project.url_key}/document/${doc_url_key}`, {});
		}

		loading = false;
	};

	const uploadPptx = async () => {
		loading = true;

		const response = await fetch('/api/translations/documents/upload-pptx', {
			method: 'POST',
			body: JSON.stringify({
				project_id: projectId,
				// document_id: documentId,
				ppt_url: pptUrl
			})
		});
		const { doc_url_key, error } = await response.json();

		if (error) {
			errorMsg = error;
		} else {
			await goto(`/project/${project.url_key}/document/${doc_url_key}`, {});
		}

		loading = false;
	};

	const uploadPdf = async () => {
		loading = true;

		const response = await fetch('/api/translations/documents/upload-pdf', {
			method: 'POST',
			body: JSON.stringify({
				project_id: projectId,
				pdf_url: pdfUrl
			})
		});
		const { doc_url_key, error } = await response.json();

		if (error) {
			errorMsg = error;
		} else {
			await goto(`/project/${project.url_key}/document/${doc_url_key}`, {});
		}

		loading = false;
	};

	function removeFile() {
		showDocIcon = false;
		showPptIcon = false;
		showPdfIcon = false;
		previewHeader = [];
		errorMsg = '';
	}
</script>

{#snippet fileSnippet(fileImageName: string, uploadFunc: any)}
	<div class="bg-white">
		<div class="flex flex-col items-center rounded-lg border border-neutral-200 p-8">
			<div class="flex w-full flex-row justify-center">
				<div
					class="box-border flex flex-row items-center justify-center gap-x-4 rounded-lg bg-gray-100 p-10"
				>
					<img alt="upload" src="/assets/icon/{fileImageName}.svg" class="h-15 w-15" />
					<p class="text-black-400 m-0 text-center text-lg">{fileName}</p>
					<button class="ml-2 flex cursor-pointer items-center justify-center" onclick={removeFile}>
						<img alt="Cross" src="/assets/icon/Cross.svg" class="h-8 w-8" />
					</button>
				</div>
			</div>
			<p class="text-md mt-6 text-center text-gray-500">Click upload when you're ready</p>
		</div>

		<div class=" py-4 text-right">
			<Button className="px-8" disabled={fileName == null} onclick={uploadFunc}>Upload</Button>
			<ErrorBox error={errorMsg} />
		</div>
	</div>
{/snippet}

{#if previewHeader.length <= 0 && !showDocIcon && !showPptIcon && !showPdfIcon}
	<button
		class="flex w-full flex-grow items-center rounded-lg border border-dashed {isDragging
			? 'border-[#5866DD] bg-[#5866DD10]'
			: 'border-[#666]'} cursor-pointer px-4 py-12"
		onclick={triggerUpload}
		ondragover={(e) => {
			e.preventDefault();
			handleDragOver(e);
		}}
		ondragleave={(e) => {
			e.preventDefault();
			handleDragLeave(e);
		}}
		ondrop={(e) => {
			e.preventDefault();
			handleDrop(e);
		}}
	>
		<div class="m-auto text-center">
			<img alt="upload" src="/assets/icon/Upload.svg" class="m-auto mb-2" />
			{#if uploading}
				<div>UPLOADING...</div>
			{:else}
				<div>
					<div class="mb-2 font-semibold">UPLOAD DOCUMENT HERE</div>
					<div class="text-md text-gray-500">
						Drag & drop your docx, pptx, csv or pdf file here or click to <span
							class="text-blue-400">browse</span
						>
					</div>
				</div>
			{/if}

			<input
				class="hidden"
				type="file"
				id="csv-uploader"
				accept=".csv,.docx,.doc,.pdf"
				onchange={handleFileSelect}
				disabled={uploading}
			/>
			<ErrorBox error={errorMsg}></ErrorBox>
		</div>
	</button>
{:else if showDocIcon}
	{@render fileSnippet('Doc', uploadDocx)}
{:else if showPptIcon}
	{@render fileSnippet('Ppt', uploadPptx)}
{:else if showPdfIcon}
	{@render fileSnippet('Pdf', uploadPdf)}
{:else if previewHeader.length > 0}
	<div>
		<TextLabel>Preview</TextLabel>
		<table class="result-table mt-4">
			<thead>
				<tr>
					{#each previewHeader as header}
						<th class="border border-slate-100">
							{header}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each previewRows as row, idx}
					{#each row as item}
						<tr>
							<td class="border border-slate-100 p-2">
								{item}
							</td>
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
		<div class="grid grid-cols-3 gap-4 pt-6">
			<div class="flex flex-row">
				<span class="text-medium mt-1 block font-semibold"> Sentence ID (optional) </span>
				<select
					bind:value={sentenceIdColIdx}
					class="ml-2 w-full rounded-lg border border-[#DDD] px-4 py-2"
				>
					<option value="null">Please select one</option>
					{#each previewHeader as label, idx}
						<option value={idx}>
							{label}
						</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-row">
				<span class="text-medium mt-1 block font-semibold"> Source Column </span>
				<select
					bind:value={sourceColIdx}
					class="ml-2 w-full rounded-lg border border-[#DDD] px-4 py-2"
				>
					<option value="null">Please select one</option>
					{#each previewHeader as label, idx}
						<option value={idx}>
							{label}
						</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-row">
				<span class="text-medium mt-1 block font-semibold"> Target Column (optional) </span>
				<select
					bind:value={targetColIdx}
					class="ml-2 w-full rounded-lg border border-[#DDD] px-4 py-2"
				>
					<option value="null">Please select one</option>
					{#each previewHeader as label, idx}
						<option value={idx}>
							{label}
						</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-row">
				<span class="text-medium mt-1 block font-semibold">
					Pargraph ID Column (optional, for input csv generated by Omniglot)
				</span>
				<select
					bind:value={paragraphIdColIdx}
					class="ml-2 w-full rounded-lg border border-[#DDD] px-4 py-2"
				>
					<option value="null">Please select one</option>
					{#each previewHeader as label, idx}
						<option value={idx}>
							{label}
						</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="mt-2">
			<span class="text-medium mr-2 inline-block font-semibold"> Is there a header row? </span>
			<input type="checkbox" bind:value={hasHeader} />
		</div>
		<div class="w-full py-4 text-right">
			<Button className="px-8" disabled={sourceColIdx == null} onclick={upload} {loading}>
				Upload
			</Button>
			<ErrorBox error={errorMsg} />
		</div>
	</div>
{/if}

{#if loading}
	<div
		class="fixed top-0 right-0 bottom-0 left-0 z-20 flex place-content-center justify-center p-4 text-[#333]"
		style="background-color: rgba(0, 0, 0, 0.3)"
	>
		<div class="m-auto text-center">
			<div class="mb-4 inline-block text-lg font-semibold text-white">
				Your file is being processed... This might take for a while!
			</div>

			<br />
			<Spinner className="inline-block" />
		</div>
	</div>
{/if}

<style lang="scss" scoped>
	.border-dashed {
		transition: all 0.2s ease-in-out;
	}
</style>
