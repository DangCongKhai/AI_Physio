<script lang="ts">
	import { onMount } from 'svelte';
	import ErrorBox from './ErrorBox.svelte';

	let {
		path,
		bucket = 'images',
		label = 'Upload profile pic',
		width = '135px',
		height = '135px',
		supabase
	} = $props();

	let uploading = $state(false);
	let src = $state('');
	let files = $state<FileList>();

	const downloadImage = async () => {
		try {
			const { data, error } = await supabase.storage.from(bucket).download(path.value);
			if (error) throw error;
			src = URL.createObjectURL(data);
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error downloading image: ', error.message);
			}
		}
	};

	const triggerUpload = async () => {
		const el = document.getElementById('avatar-uploader');
		el?.click();
	};

	const uploadImage = async (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		files = target.files || undefined;
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = files[0];
			const fileExt = file.name.split('.').pop();
			const fileName = `${Math.random()}.${fileExt}`;
			path = `${fileName}`;

			const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);

			if (uploadError) throw uploadError;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			uploading = false;
		}
	};

	onMount(() => {
		if (path.value) src = path.value;
	});

	$effect(() => {
		if (path) {
			downloadImage();
		}
	});
</script>

<div class="flex w-[{width}] h-[{height}]">
	<div class="w-full shrink-0">
		<button
			class="grid h-full w-full cursor-pointer place-content-center place-items-center rounded-lg border border-[#DDD] bg-contain bg-center bg-no-repeat text-center {src.length <=
			0
				? 'border-2 border-dashed border-[#CCC]'
				: ''}"
			onclick={triggerUpload}
		>
			{#if src.length <= 0}
				<!-- content here -->
				<div class="font-semiboldleading-4 text-center text-sm text-[#666]">
					<img alt="Upload" src="/assets/logo/Upload.svg" class="m-auto mb-2" />

					{#if uploading}
						<!-- content here -->
						<div>Uploading...</div>
					{:else}
						<!-- else content here -->
						<div>{label}</div>
					{/if}
				</div>
			{/if}
		</button>
	</div>
	<div class="flex flex-grow items-center">
		{#if src.length > 0}
			<button
				class="text-md m-auto ml-4 cursor-pointer rounded-lg border border-[#CCC] bg-transparent px-4 py-2 text-[#CCC]"
				onclick={triggerUpload}
			>
				{uploading ? 'UPLOADING...' : 'CHANGE PIC'}
			</button>
		{/if}

		<input
			class="hidden"
			type="file"
			id="avatar-uploader"
			accept="image/*"
			onchange={uploadImage}
			disabled={uploading}
		/>
	</div>
</div>
